import { env } from 'cloudflare:workers';
import { AutoRouter, withContent } from 'itty-router';

const router = AutoRouter();

const models = [
  '@hf/meta-llama/meta-llama-3-8b-instruct',
  '@cf/meta/llama-3.2-3b-instruct',
  '@cf/deepseek-ai/deepseek-math-7b-instruct',
  '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
  '@cf/defog/sqlcoder-7b-2',
  '@cf/fblgit/una-cybertron-7b-v2-bf16',
  '@cf/google/gemma-2b-it-lora',
  '@cf/google/gemma-7b-it-lora',
  '@cf/meta-llama/llama-2-7b-chat-hf-lora',
  '@cf/meta/llama-2-7b-chat-fp16',
  '@cf/meta/llama-2-7b-chat-int8',
  '@cf/meta/llama-3-8b-instruct',
  '@cf/meta/llama-3-8b-instruct-awq',
  '@cf/meta/llama-3.1-8b-instruct',
  '@cf/meta/llama-3.1-8b-instruct-awq',
  '@cf/meta/llama-3.1-8b-instruct-fp8',
  '@cf/meta/llama-3.2-1b-instruct',
  '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  '@cf/microsoft/phi-2',
  '@cf/mistral/mistral-7b-instruct-v0.1',
  '@cf/mistral/mistral-7b-instruct-v0.2-lora',
  '@cf/openchat/openchat-3.5-0106',
  '@cf/qwen/qwen1.5-0.5b-chat',
  '@cf/qwen/qwen1.5-0.5b-chat',
  '@cf/qwen/qwen1.5-7b-chat-awq',
  '@cf/qwen/qwen1.5-14b-chat-awq',
  '@cf/thebloke/discolm-german-7b-v1-awq',
  '@cf/tiiuae/falcon-7b-instruct',
  '@cf/tinyllama/tinyllama-1.1b-chat-v1.0',
  '@hf/google/gemma-7b-it',
  '@hf/mistral/mistral-7b-instruct-v0.2',
  '@hf/nexusflow/starling-lm-7b-beta',
  '@hf/nousresearch/hermes-2-pro-mistral-7b',
  '@hf/thebloke/deepseek-coder-6.7b-base-awq',
  '@hf/thebloke/deepseek-coder-6.7b-instruct-awq',
  '@hf/thebloke/llama-2-13b-chat-awq',
  '@hf/thebloke/llamaguard-7b-awq',
  '@hf/thebloke/mistral-7b-instruct-v0.1-awq',
  '@hf/thebloke/neural-chat-7b-v3-1-awq',
  '@hf/thebloke/openhermes-2.5-mistral-7b-awq',
  '@hf/thebloke/zephyr-7b-beta-awq',
];

const defaultModel = '@hf/llama/llama-3.1-8b-instruct';

router.get('/api/models', () => models);

router.post('/api/prompt', withContent, async ({ content }) => {
  if (content.model && !models.includes(content.model)) {
    return new Response(`Model ${content.model} is not supported`, { status: 400 });
  }
  if (!content || !content.prompt) {
    return new Response('Prompt is required', { status: 400 });
  }

  const model = content.model || defaultModel;
  const { response, usage } = await env.AI.run(model, {
    prompt: content.prompt,
  });

  console.info('Usage:', usage);

  return { response };
});

export default router;
