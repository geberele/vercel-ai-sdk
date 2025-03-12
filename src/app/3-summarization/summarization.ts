'use server';

import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import {
  llama_local_llama3_2,
  openai_gpt_4o_mini,
  claude_3_haiku,
} from '@/lib/models';

// Generate a summary of all the comments so we don't have to read through everything.
export const generateSummary = async (comments: any[]) => {
  try {
    // Scenario 1: generateObject no-schema
    // const result = await generateObject({
    //   model: openai_gpt_4o_mini,
    //   prompt: `Please summarise the following comments.
    //     ---
    //     Comments:
    //     ${JSON.stringify(comments)}`,
    //   output: 'no-schema',
    // });

    // Scenario 2: generateObject with schema
    // const result = await generateObject({
    //   model: llama_local_llama3_2,
    //   prompt: `Please summarise the following comments.
    //     ---
    //     Comments:
    //     ${JSON.stringify(comments)}`,
    //   schema: z.object({
    //     headline: z.string(),
    //     context: z.string(),
    //     discussionPoints: z.string(),
    //     takeaways: z.string(),
    //   }),
    //   output: 'array',
    // });

    // Scenario 3: generateObject with an improved schema
    const result = await generateObject({
      model: llama_local_llama3_2, // llama_local_llama3_2 or claude_3_haiku
      prompt: `Please summarise the following comments.
      ---
      Comments:
      ${JSON.stringify(comments)}`,
      schema: z.object({
        headline: z
          .string()
          .describe('The headline of the summary. Max 5 words.'),
        context: z
          .string()
          .describe(
            'What is the relevant context that prompted discussion. Max 2 sentences.'
          ),
        discussionPoints: z
          .string()
          .describe('What are the key discussion points? Max 2 sentences.'),
        takeaways: z
          .string()
          .describe(
            'What are the key takeaways / next steps? Include names. Max 2 sentences.'
          ),
      }),
      output: 'array',
    });

    return result.object;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
};
