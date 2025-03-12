import 'dotenv/config';
import fs from 'fs';
import { generateText, streamText } from 'ai';
import {
  llama_local_ds_r1,
  llama_local_llama3_2,
  openai_gpt_4o_mini,
} from '@/lib/models';

// Import essay
const essay = fs.readFileSync('src/app/1-extraction/essay.txt', 'utf-8');

const main = async () => {
  // Scenario 1 - generate text
  // const result = await generateText({
  //   model: llama_local_llama3_2,
  //   prompt:
  //     'What is the key takeaway of this piece in 50 words?' + '\n\n' + essay,
  //   maxTokens: 100,
  //   temperature: 1,
  // });
  // console.log(result.text);

  // Scenario 2 - stream text
  const { textStream } = await streamText({
    model: openai_gpt_4o_mini,
    prompt:
      'What is the key takeaway of this piece in 250 words?' + '\n\n' + essay,
    maxTokens: 100,
    temperature: 1,
  });
  for await (const chunk of textStream) {
    process.stdout.write(chunk);
  }
};

main().catch(console.error);
