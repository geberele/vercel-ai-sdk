import 'dotenv/config';
import { createOllama } from 'ollama-ai-provider';
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { openai } from '@ai-sdk/openai';

// OLLAMA LOCAL
const llama_local_llama3_3 = createOllama({
  baseURL: 'http://localhost:11434/api',
})('llama3.3:latest'); // 42 GB

const llama_local_llama3_2 = createOllama({
  baseURL: 'http://localhost:11434/api',
})('llama3.2:latest'); // 2.0 GB

const llama_local_ds_r1 = createOllama({
  baseURL: 'http://localhost:11434/api',
})('deepseek-r1:latest'); // 4.7 GB

// OPENAI
const openai_gpt_4o = openai('gpt-4o');
const openai_gpt_4o_mini = openai('gpt-4o-mini-2024-07-18');

// BEDROCK
const bedrock = createAmazonBedrock({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const claude_3_sonnet = bedrock('anthropic.claude-3-sonnet-20240229-v1:0'); // 1 request per minute
const claude_3_haiku = bedrock('anthropic.claude-3-haiku-20240307-v1:0'); // 4 requests per minute

const llama_3_8b = bedrock('meta.llama3-8b-instruct-v1:0'); // 80 requests per minute
const llama_3_70b = bedrock('meta.llama3-70b-instruct-v1:0'); // 40 requests per minute

const mistral_large = bedrock('mistral.mistral-large-2402-v1:0'); // 40 requests per minute
const mistral_instruct = bedrock('mistral.mistral-7b-instruct-v0:2'); // 80 requests per minute

export {
  claude_3_sonnet,
  claude_3_haiku,
  llama_3_8b,
  llama_3_70b,
  mistral_large,
  mistral_instruct,
  llama_local_llama3_3,
  llama_local_llama3_2,
  llama_local_ds_r1,
  openai_gpt_4o,
  openai_gpt_4o_mini,
};
