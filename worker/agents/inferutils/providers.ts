/**
 * Provider Router - Centralized model routing logic
 * Routes inference calls to appropriate AI providers
 */

import { callTogetherChat, type TogetherChatArgs } from '../../clients/together';

/**
 * Together AI model detection
 * Detects if a model should be routed to Together AI
 */
export function isTogetherModel(modelName: string): boolean {
    // Explicit together prefix
    if (modelName.startsWith('together:') || modelName.startsWith('together/')) {
        return true;
    }

    // DeepSeek models on Together
    if (
        modelName === 'deepseek-v3' ||
        modelName === 'deepseek-ai/DeepSeek-V3' ||
        modelName.startsWith('deepseek-') ||
        modelName.startsWith('deepseek-ai/')
    ) {
        return true;
    }

    // Qwen models on Together
    if (
        modelName === 'qwen2.5' ||
        modelName === 'qwen2.5-coder' ||
        modelName === 'qwen2.5-coder-32b-instruct' ||
        modelName.startsWith('qwen2.5') ||
        modelName.startsWith('Qwen/')
    ) {
        return true;
    }

    // Generic "together" in name
    if (modelName.toLowerCase().includes('together')) {
        return true;
    }

    return false;
}

/**
 * Normalize Together model name
 * Removes together: or together/ prefix and maps aliases
 */
export function normalizeTogetherModelName(modelName: string): string {
    // Remove prefix
    let normalized = modelName.replace(/^together[:/]/, '');

    // Map common aliases to full model names
    const aliasMap: Record<string, string> = {
        'deepseek-v3': 'deepseek-ai/DeepSeek-V3',
        'qwen2.5-coder': 'Qwen/Qwen2.5-Coder-32B-Instruct',
        'qwen2.5-coder-32b-instruct': 'Qwen/Qwen2.5-Coder-32B-Instruct',
        'qwen2.5': 'Qwen/QwQ-32B-Preview',
    };

    return aliasMap[normalized] || normalized;
}

export interface RunInferenceArgs {
    name: string;
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

export interface RunInferenceResponse {
    content: string;
    stream?: ReadableStream;
    raw?: any;
}

/**
 * Unified inference router
 * Routes to appropriate provider based on model name
 */
export async function runInference(
    args: RunInferenceArgs,
    env: Env
): Promise<RunInferenceResponse> {
    // Route to Together AI
    if (isTogetherModel(args.name)) {
        const normalizedModel = normalizeTogetherModelName(args.name);
        console.log(`Routing to Together AI: ${args.name} -> ${normalizedModel}`);

        const togetherArgs: TogetherChatArgs = {
            model: normalizedModel,
            messages: args.messages,
            temperature: args.temperature,
            max_tokens: args.max_tokens,
            stream: args.stream,
            top_p: args.top_p,
            stop: args.stop,
        };

        const result = await callTogetherChat(togetherArgs, env);

        if ('stream' in result) {
            return { content: '', stream: result.stream };
        }

        return { content: result.content, raw: result.raw };
    }

    // Fallback: model not supported by router yet
    throw new Error(`Provider routing not implemented for model: ${args.name}. Please use the existing inference system or add Together AI prefix.`);
}