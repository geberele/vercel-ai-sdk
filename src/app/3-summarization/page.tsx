'use client';

import { useState } from 'react';
import { Box, Text, Button, Heading, VStack } from '@chakra-ui/react';

import { generateSummaryObject } from './summarization';
import messages from './messages.json';
import { Comment } from '@/components/Comments';

export default function Home() {
  const [summary, setSummary] = useState<Awaited<
    ReturnType<typeof generateSummaryObject>
  > | null>(null);

  const [loading, setLoading] = useState(false);

  return (
    <main>
      <Box m={4} maxW="xl" display="flex" flexDirection="column" width="100%">
        <Heading size="3xl">Comments</Heading>
        <Button
          mt={4}
          width="100%"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            // generate summary
            const summary = await generateSummaryObject(messages);
            console.log('Summary:', summary);
            setSummary(summary);
            setLoading(false);
          }}
        >
          Summar{loading ? 'izing...' : 'ize'}
        </Button>
      </Box>

      {/* Summary */}
      {summary && (
        <Box px={4} className="summary" mb={30}>
          <Heading size="md" mb={4} fontWeight="bold">
            Summary
          </Heading>

          <VStack gap={5} align="left" maxW="xl">
            {summary.map((item) => (
              <Box
                key={item.headline}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                p={6}
                shadow="sm"
                bg="gray.50"
              >
                <VStack align="stretch" spacing={4}>
                  <Heading as="h3" size="md" color="blue.600">
                    {item.headline}
                  </Heading>

                  <Box>
                    <Text fontWeight="bold" color="gray.700" mb={1}>
                      Context
                    </Text>
                    <Text color="gray.600">{item.context}</Text>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" color="gray.700" mb={1}>
                      Discussion Points
                    </Text>
                    <Text color="gray.600">{item.discussionPoints}</Text>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" color="gray.700" mb={1}>
                      Key Takeaways
                    </Text>
                    <Text color="gray.600">{item.takeaways}</Text>
                  </Box>
                </VStack>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
      {messages.map((message) => (
        <Comment key={message.id} comment={message} />
      ))}
    </main>
  );
}
