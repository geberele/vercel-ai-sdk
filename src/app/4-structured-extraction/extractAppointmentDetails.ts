'use server';

import { generateObject, streamObject } from 'ai';
import { openai_gpt_4o_mini, llama_local_llama3_2 } from '@/lib/models';
import { z } from 'zod';

export const extractAppointmentDetails = async (appointment: string) => {
  try {
    // Scenario 1: simple schema
    // const result = await generateObject({
    //   model: openai_gpt_4o_mini,
    //   prompt: `Extract the appointment details from the following text: ${appointment}`,
    //   schema: z.object({
    //     appointment: z.string().describe('The appointment details'),
    //   }),
    //   output: 'array',
    // });
    // return result;

    // Scenario 2: complex schema
    const result = await streamObject({
      model: openai_gpt_4o_mini,
      prompt: `Extract the appointment details from the following text: ${appointment}`,
      schema: z.object({
        title: z.string(),
        startTime: z.string().nullable(),
        endTime: z.string().nullable(),
        attendees: z
          .array(z.string().describe('List of people attending the meeting'))
          .nullable(),
        location: z.string().nullable(),
        date: z.string(),
      }),
      output: 'array',
    });
    for await (const partialObject of result.partialObjectStream) {
      console.clear();
      console.dir(partialObject);
    }
    console.clear();
    const finalResult = await result.object;
    const finalUsage = await result.usage;
    return { object: finalResult, usage: finalUsage };
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
};
