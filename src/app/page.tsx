import { Box, Heading, Text, List } from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Box m={4} maxW="xl" display="flex" flexDirection="column" width="100%">
        <Heading size="3xl">Vercel AI SDK Demo</Heading>
        <p>
          Explore these examples showcasing different capabilities of the Vercel
          AI SDK for building AI-powered applications.
        </p>
        <Heading size="2xl" mt={4}>
          Examples
        </Heading>
        <List.Root m={4}>
          <List.Item style={{ marginBottom: '10px' }}>
            <Text fontWeight="bold">Summarization:</Text>
            <Link
              href="/3-summarization"
              style={{ textDecoration: 'underline' }}
            >
              Create concise summaries of longer texts
            </Link>
          </List.Item>
          <List.Item style={{ marginBottom: '10px' }}>
            <Text fontWeight="bold">Chat:</Text>
            <Link href="/5-chat" style={{ textDecoration: 'underline' }}>
              Implement a conversational interface with AI
            </Link>
          </List.Item>
        </List.Root>
      </Box>
    </main>
  );
}
