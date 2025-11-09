/**
 * Together AI Client - Cloudflare Workers compatible
 * Server-side only wrapper for Together AI API calls
 */

export interface TogetherChatArgs {
    model: string;
    messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
    }>; 
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
    top_p?: number;
    stop?: string[];
}

export interface TogetherChatResponse {
    content: string;
    raw: any;
}

export interface TogetherStreamResponse {
    stream: ReadableStream;
}

/**
 * Call Together AI chat completion API
 * Compatible with Cloudflare Workers runtime (uses native fetch)
 */
export async function callTogetherChat(
    args: TogetherChatArgs,
    env: Env
): Promise<TogetherChatResponse | TogetherStreamResponse> {
    const apiKey = env.TOGETHER_API_KEY;
    
    if (!apiKey || apiKey.trim() === '') {
        throw new Error('TOGETHER_API_KEY is not configured');
    }

    const requestBody = {
        model: args.model,
        messages: args.messages,
        temperature: args.temperature ?? 0.2,
        max_tokens: args.max_tokens ?? 2048,
        stream: args.stream ?? false,
        top_p: args.top_p ?? 1,
        ...(args.stop && { stop: args.stop }),
    };

    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Together AI API error (${response.status}): ${errorText}`);
    }

    // Handle streaming response
    if (args.stream) {
        if (!response.body) {
            throw new Error('Together AI streaming response has no body');
        }

        // Create a transform stream to parse SSE events
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Process stream in background
        (async () => {
            try {
                let buffer = '';
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6).trim();
                            if (data === '[DONE]') continue;
                            
                            try {
                                const parsed = JSON.parse(data);
                                const content = parsed.choices?.[0]?.delta?.content;
                                if (content) {
                                    await writer.write(new TextEncoder().encode(content));
                                }
                            } catch (e) {
                                console.warn('Failed to parse Together AI SSE chunk:', e);
                            }
                        }
                    }
                }
                await writer.close();
            } catch (error) {
                console.error('Together AI stream processing error:', error);
                await writer.abort(error);
            }
        })();

        return { stream: readable };
    }

    // Handle non-streaming response
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return {
        content,
        raw: data,
    };
}
