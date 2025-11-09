import { AIModels } from './config.types';

describe('AIModels Configuration', () => {
	describe('Together AI Models', () => {
		test('should have TOGETHER_DEEPSEEK_V3 model defined', () => {
			expect(AIModels.TOGETHER_DEEPSEEK_V3).toBe('together/deepseek-ai/DeepSeek-V3');
		});

		test('should have TOGETHER_QWEN_2_5_CODER model defined', () => {
			expect(AIModels.TOGETHER_QWEN_2_5_CODER).toBe('together/Qwen/Qwen2.5-Coder-32B-Instruct');
		});

		test('should have TOGETHER_LLAMA_3_3_70B model defined', () => {
			expect(AIModels.TOGETHER_LLAMA_3_3_70B).toBe('together/meta-llama/Llama-3.3-70B-Instruct-Turbo');
		});
	});

	describe('Gemini Models', () => {
		test('should have Gemini models defined', () => {
			expect(AIModels.GEMINI_2_5_PRO).toBe('google-ai-studio/gemini-2.5-pro');
			expect(AIModels.GEMINI_2_5_FLASH).toBe('google-ai-studio/gemini-2.5-flash');
			expect(AIModels.GEMINI_2_5_FLASH_LITE).toBe('google-ai-studio/gemini-2.5-flash-lite');
		});
	});

	describe('Claude Models', () => {
		test('should have Claude models defined', () => {
			expect(AIModels.CLAUDE_4_SONNET).toBe('anthropic/claude-sonnet-4-20250514');
			expect(AIModels.CLAUDE_4_OPUS).toBe('anthropic/claude-opus-4-20250514');
		});
	});

	describe('OpenAI Models', () => {
		test('should have OpenAI models defined', () => {
			expect(AIModels.OPENAI_5).toBe('openai/gpt-5');
			expect(AIModels.OPENAI_5_MINI).toBe('openai/gpt-5-mini');
			expect(AIModels.OPENAI_O3).toBe('openai/o3');
		});
	});

	describe('Special Models', () => {
		test('should have DISABLED model defined', () => {
			expect(AIModels.DISABLED).toBe('disabled');
		});
	});

	describe('Model Name Format', () => {
		test('Together AI models should follow together/ prefix format', () => {
			expect(AIModels.TOGETHER_DEEPSEEK_V3).toMatch(/^together\//);
			expect(AIModels.TOGETHER_QWEN_2_5_CODER).toMatch(/^together\//);
			expect(AIModels.TOGETHER_LLAMA_3_3_70B).toMatch(/^together\//);
		});

		test('Gemini models should follow google-ai-studio/ prefix format', () => {
			expect(AIModels.GEMINI_2_5_PRO).toMatch(/^google-ai-studio\//);
			expect(AIModels.GEMINI_2_5_FLASH).toMatch(/^google-ai-studio\//);
		});

		test('OpenAI models should follow openai/ prefix format', () => {
			expect(AIModels.OPENAI_5).toMatch(/^openai\//);
			expect(AIModels.OPENAI_O3).toMatch(/^openai\//);
		});

		test('Claude models should follow anthropic/ prefix format', () => {
			expect(AIModels.CLAUDE_4_SONNET).toMatch(/^anthropic\//);
			expect(AIModels.CLAUDE_4_OPUS).toMatch(/^anthropic\//);
		});
	});
});
