import { UIMessage } from 'ai';
import { VStack, Box } from '@chakra-ui/react';
import { WeatherCard, WeatherResult } from './WeatherCard';
import { FormatMessageContent } from './FormatMessageContent';
import { TimeDisplay } from '@/components/TimeDisplay';

interface TimeData {
  currentTime: string;
  timezone: string;
  timestamp: number;
}

export const Messages = ({ messages }: { messages: UIMessage[] }) => {
  return (
    <VStack px={2} py={4} maxW="100%" position="relative" mb={200}>
      <Box
        maxW="800px"
        flex="1"
        w="100%"
        display="flex"
        flexDirection="column-reverse"
      >
        <VStack w="100%" gap={4}>
          {messages.map((m) => (
            <Box
              key={m.id}
              bg={m.role === 'user' ? 'blue.500' : 'gray.100'}
              color={m.role === 'user' ? 'white' : 'black'}
              p={3}
              borderRadius="md"
              alignSelf={m.role === 'user' ? 'flex-end' : 'flex-start'}
              maxW="75%"
            >
              <div style={{ fontWeight: 'bold' }}>
                {m.role === 'user' ? 'Gab' : 'AI'}
              </div>

              {/* Format message content with think blocks */}
              <div style={{ marginTop: '4px' }}>
                {<FormatMessageContent content={m.content} />}
              </div>

              {m.toolInvocations &&
                m.toolInvocations.map((toolInvocation) => {
                  // console.log(toolInvocation);
                  if (
                    toolInvocation.toolName === 'getWeather' &&
                    toolInvocation.state === 'result' &&
                    'result' in toolInvocation
                  ) {
                    const weatherData = toolInvocation.result as WeatherResult;
                    return (
                      <WeatherCard
                        key={toolInvocation.toolCallId}
                        temperature={weatherData.temperature}
                        weathercode={weatherData.weathercode}
                        relativehumidity={weatherData.relativehumidity}
                        city={weatherData.city}
                      />
                    );
                  }
                  if (
                    toolInvocation.toolName === 'getTime' &&
                    toolInvocation.state === 'result' &&
                    'result' in toolInvocation
                  ) {
                    const timeData = toolInvocation.result as TimeData;

                    if (timeData && timeData.timezone) {
                      return (
                        <TimeDisplay
                          key={toolInvocation.toolCallId}
                          timezone={timeData.timezone}
                        />
                      );
                    }
                  }
                  return null;
                })}
            </Box>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};
