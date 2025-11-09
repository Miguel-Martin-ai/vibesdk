import { isTogetherModel, normalizeTogetherModelName } from './providers';

describe('Together AI Provider Detection', () => {
	describe('isTogetherModel', () => {
		test('should detect together: prefix', () => {
			expect(isTogetherModel('together:deepseek-ai/DeepSeek-V3')).toBe(true);
			expect(isTogetherModel('together:qwen2.5-coder')).toBe(true);
		});

		test('should detect together/ prefix', () => {
			expect(isTogetherModel('together/deepseek-ai/DeepSeek-V3')).toBe(true);
			expect(isTogetherModel('together/Qwen/Qwen2.5-Coder-32B-Instruct')).toBe(true);
		});

		test('should detect DeepSeek models', () => {
			expect(isTogetherModel('deepseek-v3')).toBe(true);
			expect(isTogetherModel('deepseek-ai/DeepSeek-V3')).toBe(true);
			expect(isTogetherModel('deepseek-coder')).toBe(true);
		});

		test('should detect Qwen models', () => {
			expect(isTogetherModel('qwen2.5')).toBe(true);
			expect(isTogetherModel('qwen2.5-coder')).toBe(true);
			expect(isTogetherModel('qwen2.5-coder-32b-instruct')).toBe(true);
			expect(isTogetherModel('Qwen/Qwen2.5-Coder-32B-Instruct')).toBe(true);
		});

		test('should detect "together" in model name', () => {
			expect(isTogetherModel('my-together-model')).toBe(true);
		});

		test('should not detect non-Together models', () => {
			expect(isTogetherModel('openai/gpt-4')).toBe(false);
			expect(isTogetherModel('anthropic/claude-3')).toBe(false);
			expect(isTogetherModel('google-ai-studio/gemini-pro')).toBe(false);
		});
	});

	describe('normalizeTogetherModelName', () => {
		test('should remove together: prefix', () => {
			expect(normalizeTogetherModelName('together:deepseek-v3')).toBe('deepseek-ai/DeepSeek-V3');
		});

		test('should remove together/ prefix', () => {
			expect(normalizeTogetherModelName('together/deepseek-v3')).toBe('deepseek-ai/DeepSeek-V3');
		});

		test('should normalize deepseek-v3 alias', () => {
			expect(normalizeTogetherModelName('deepseek-v3')).toBe('deepseek-ai/DeepSeek-V3');
		});

		test('should normalize qwen2.5-coder alias', () => {
			expect(normalizeTogetherModelName('qwen2.5-coder')).toBe('Qwen/Qwen2.5-Coder-32B-Instruct');
			expect(normalizeTogetherModelName('qwen2.5-coder-32b-instruct')).toBe('Qwen/Qwen2.5-Coder-32B-Instruct');
		});

		test('should normalize qwen2.5 alias', () => {
			expect(normalizeTogetherModelName('qwen2.5')).toBe('Qwen/QwQ-32B-Preview');
		});

		test('should keep full model names unchanged', () => {
			expect(normalizeTogetherModelName('deepseek-ai/DeepSeek-V3')).toBe('deepseek-ai/DeepSeek-V3');
			expect(normalizeTogetherModelName('Qwen/Qwen2.5-Coder-32B-Instruct')).toBe('Qwen/Qwen2.5-Coder-32B-Instruct');
		});

		test('should handle unknown models', () => {
			const unknownModel = 'some-unknown-model';
			expect(normalizeTogetherModelName(unknownModel)).toBe(unknownModel);
		});
	});
});
