'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import {
  formatTime,
  formatDate,
  getTimezoneAbbr,
  parseDateString,
  createFallbackTimeData,
} from '@/lib/utils';

export interface TimeDisplayProps {
  timezone?: string;
  showSeconds?: boolean;
  use24Hour?: boolean;
}

export const TimeDisplay = ({
  timezone,
  showSeconds = true,
  use24Hour = false,
}: TimeDisplayProps) => {
  const [time, setTime] = useState<Date>(new Date());
  const [timeData, setTimeData] = useState<{
    currentTime: string;
    timezone: string;
    timestamp: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Update time every second for local time display
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch time from API if timezone is provided
  useEffect(() => {
    if (timezone) {
      const fetchTime = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [
                {
                  role: 'user',
                  content: `What time is it in ${timezone}?`,
                },
              ],
              disableTools: false,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch time');
          }

          const reader = response.body?.getReader();
          if (!reader) throw new Error('Response body is null');

          // Process the stream chunks as they arrive
          let done = false;
          let timeDataReceived = false;
          let fullText = '';

          while (!done && !timeDataReceived) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;

            if (value) {
              const chunk = new TextDecoder().decode(value);
              fullText += chunk;

              // Look for complete tool invocation result
              if (
                fullText.includes('"toolName":"getTime"') &&
                fullText.includes('"currentTime"')
              ) {
                try {
                  // Extract the JSON data using a more robust approach
                  const toolMatch = fullText.match(
                    /"toolName":"getTime".*?"result":({.*?})/
                  );
                  if (toolMatch && toolMatch[1]) {
                    // Parse the result object directly
                    const resultJson = toolMatch[1].replace(/\\"/g, '"');
                    const parsedData = JSON.parse(resultJson);

                    console.log('Parsed time data:', parsedData);

                    if (parsedData.currentTime && parsedData.timezone) {
                      // Verify the timezone matches what we requested
                      if (parsedData.timezone.includes(timezone)) {
                        setTimeData(parsedData);
                        timeDataReceived = true;
                      }
                    }
                  }
                } catch (e) {
                  console.error('Error parsing time data:', e, fullText);
                }
              }
            }
          }

          if (!timeDataReceived) {
            // Fallback to client-side timezone conversion if API failed
            setTimeData(
              createFallbackTimeData(timezone, showSeconds, use24Hour)
            );
          }

          reader.releaseLock();
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch time data'
          );
          console.error('Error fetching time:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchTime();
    }
  }, [timezone, showSeconds, use24Hour]);

  // Get formatted local time
  const localTime = formatTime(time, showSeconds, use24Hour);

  // Get formatted local date
  const localDate = formatDate(time);

  // Create title text
  const titleText = timezone
    ? `Time in ${getTimezoneAbbr(timeData?.timezone || timezone)}`
    : 'Current Time';

  // Create time text
  const timeText =
    timezone && timeData
      ? timeData.currentTime.split(', ')[1] // Extract only the time part
      : localTime;

  // Create date text in DD-MM-YYYY format
  const dateText =
    timezone && timeData
      ? parseDateString(timeData.currentTime, localDate)
      : localDate;

  return (
    <Box
      w="100%"
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      p={5}
      bg="white"
      my={4}
    >
      {loading ? (
        <Flex justifyContent="center">
          <Spinner color="black" />
        </Flex>
      ) : (
        <Box textAlign="center">
          <Box as="h2" fontSize="lg" fontWeight="medium" color="black" mb={2}>
            {titleText}
          </Box>

          <Box
            color="black"
            fontSize="3xl"
            fontWeight="bold"
            mb={2}
            fontFamily="mono"
          >
            {timeText}
          </Box>

          <Box color="blackAlpha.800" fontSize="sm">
            {dateText}
          </Box>

          {error && (
            <Box mt={2} bg="red.500" p={2} borderRadius="md">
              <Box color="red.200" fontSize="sm">
                {error}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
