import { NextResponse } from 'next/server';
import { streamText } from 'ai';
import {
  openai_gpt_4o_mini,
  claude_3_haiku,
  claude_3_sonnet,
  mistral_large,
  llama_3_70b,
  llama_local_ds_r1,
} from '@/lib/models';
import { z } from 'zod';
import { addOllamaLogging } from '../../../lib/utils';

// Allow streaming responses up to 60 seconds for local models which might be slower
export const maxDuration = 60;

// Model mapping
const MODEL_MAP = {
  openai_gpt_4o_mini,
  claude_3_haiku,
  claude_3_sonnet,
  mistral_large,
  llama_3_70b,
  llama_local_ds_r1,
};

export async function POST(req: Request) {
  try {
    const {
      messages,
      modelId = 'openai_gpt_4o_mini',
      disableTools = false,
    } = await req.json();

    // Get the selected model, fallback to default if not found
    const selectedModel =
      MODEL_MAP[modelId as keyof typeof MODEL_MAP] || openai_gpt_4o_mini;

    console.log(`Using model: ${modelId}, Tools disabled: ${disableTools}`);

    // Adds additional logging for local models
    if (modelId.includes('local')) {
      addOllamaLogging();
    }

    // Scenario 1: simple stream (Q: What do you think of Bill?)
    // const result = await streamText({
    //   model: selectedModel,
    //   system: `You are Steve Jobs. Assume his character, both strengths and flaws.
    //     Respond exactly how he would, in exactly his tone.
    //     It is 1984 you have just created the Macintosh.`,
    //   messages,
    // });

    // Scenario 2: stream with tools (Q: What's the weather like in San Francisco?)
    // Tools are actions that an LLM can invoke.
    // The results of these actions can be reported back to the LLM to be considered in the next response.
    const result = await streamText({
      model: selectedModel,
      system: `You are a helpful, friendly AI assistant. You communicate clearly and provide thoughtful, accurate responses.
        When given a task, you complete it to the best of your abilities using the information available to you.`,
      messages,
      tools: disableTools
        ? undefined
        : {
            getWeather: {
              description: 'Get the weather in a given location',
              parameters: z.object({
                latitude: z.number(),
                longitude: z.number(),
                city: z.string(),
              }),
              execute: async ({ latitude, longitude, city }) => {
                const response = await fetch(
                  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,relativehumidity_2m&timezone=auto`
                );
                const weatherData = await response.json();
                return {
                  temperature: weatherData.current.temperature_2m,
                  weathercode: weatherData.current.weathercode,
                  relativehumidity: weatherData.current.relativehumidity_2m,
                  city,
                };
              },
            },
            getTime: {
              description:
                'Get the current time, optionally in a specific timezone',
              parameters: z.object({
                timezone: z
                  .string()
                  .optional()
                  .describe(
                    'Optional timezone in IANA format (e.g., "America/New_York", "Europe/London")'
                  ),
              }),
              execute: async ({ timezone }) => {
                console.log('timezone', timezone);
                const now = new Date();
                let timeString;
                let timezoneName;

                try {
                  if (timezone) {
                    timeString = now.toLocaleString('en-US', {
                      timeZone: timezone,
                    });
                    timezoneName = timezone;
                  } else {
                    timeString = now.toLocaleString();
                    timezoneName =
                      Intl.DateTimeFormat().resolvedOptions().timeZone;
                  }
                } catch (error) {
                  // If timezone is invalid, fall back to local time
                  console.error(
                    `Invalid timezone provided: ${timezone}`,
                    error
                  );
                  timeString = now.toLocaleString();
                  timezoneName =
                    Intl.DateTimeFormat().resolvedOptions().timeZone;
                }

                return {
                  currentTime: timeString,
                  timezone: timezoneName,
                  timestamp: now.getTime(),
                };
              },
            },
          },
    });
    // console.log(result.toDataStreamResponse());
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      {
        error:
          'Failed to process chat request: ' +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
