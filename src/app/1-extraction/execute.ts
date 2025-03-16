import 'dotenv/config';
import fs from 'fs';
import { generateText, streamText } from 'ai';
import {
  llama_local_ds_r1,
  llama_local_llama3_2,
  openai_gpt_4o_mini,
  llama_3_70b,
} from '@/lib/models';
import { logUsage } from '../../lib/utils';

// Import essay
const essay = fs.readFileSync('src/app/1-extraction/essay.txt', 'utf-8');

const main = async () => {
  // Scenario 1 - generate text
  const result = await generateText({
    model: llama_3_70b, // llama_3_70b or llama_local_llama3_2
    prompt:
      'What is the key takeaway of this piece in 50 words?' + '\n\n' + essay,
    maxTokens: 100,
    temperature: 1, // 0.0 (low - deterministic) - 1.0 (high - random)
  });
  console.log(result.text);
  logUsage(result.usage);

  // Scenario 2 - stream text
  // const result = await streamText({
  //   model: llama_local_llama3_2, // llama_local_llama3_2 or openai_gpt_4o_mini
  //   prompt:
  //     'What is the key takeaway of this piece in 250 words?' + '\n\n' + essay,
  //   temperature: 1,
  // });

  // // Print chunks as they arrive
  // for await (const chunk of result.textStream) {
  //   process.stdout.write(chunk);
  // }
  // // Log final metadata after streaming completes
  // const usage = await result.usage;
  // logUsage(usage);
};

main().catch(console.error);
