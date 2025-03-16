import 'dotenv/config';
import supportRequests from './support_requests.json';
import { generateText, generateObject } from 'ai';
import { z } from 'zod';
import {
  llama_local_ds_r1,
  llama_local_llama3_2,
  mistral_large,
  llama_3_70b,
  openai_gpt_4o_mini,
  claude_3_sonnet,
} from '@/lib/models';
import { logUsage } from '../../lib/utils';

async function main() {
  // Scenario 1: generateText
  const result = await generateText({
    model: llama_local_ds_r1,
    prompt:
      'Classify the following support requests.\n\n' +
      JSON.stringify(supportRequests),
  });
  console.log(result.text);
  logUsage(result.usage);

  // Scenario 2: generateObject (no schema)
  // const result = await generateObject({
  //   model: llama_local_llama3_2, // llama_local_llama3_2 or llama_local_ds_r1
  //   prompt:
  //     'Classify the following support requests.\n\n' +
  //     JSON.stringify(supportRequests),
  //   output: 'no-schema',
  // });
  // console.log(result.object);
  // logUsage(result.usage);

  // Scenario 3: generateObject (with schema)
  // const result = await generateObject({
  //   model: openai_gpt_4o_mini,
  //   prompt:
  //     'Classify the following support requests.\n\n' +
  //     JSON.stringify(supportRequests),
  //   schema: z.object({
  //     request: z.string(),
  //     category: z.enum([
  //       'billing',
  //       'product issues',
  //       'enterprise sales',
  //       'account issues',
  //       'product feedback',
  //     ]),
  //     urgency: z.enum(['low', 'medium', 'high']),
  //     language: z
  //       .string()
  //       .describe(
  //         'The language the support request is in. eg. English, Spanish etc.'
  //       ),
  //   }),
  //   output: 'array',
  // });
  // console.log(result.object);
  // logUsage(result.usage);
}

main().catch(console.error);
