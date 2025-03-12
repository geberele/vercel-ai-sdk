'use client';

import { useChat } from 'ai/react';
import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Container,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

import { WeatherCard } from '@/components/WeatherCard';

// Define the weather result type for clarity
interface WeatherResult {
  temperature: number;
  weathercode: number;
  relativehumidity: number;
  city: string;
}

// Define available models
const AVAILABLE_MODELS = [
  { id: 'openai_gpt_4o_mini', name: 'GPT-4o Mini' },
  { id: 'claude_3_haiku', name: 'Claude 3 Haiku' },
  { id: 'claude_3_sonnet', name: 'Claude 3 Sonnet' },
  { id: 'mistral_large', name: 'Mistral Large' },
  { id: 'llama_3_70b', name: 'Llama 3 70B' },
  { id: 'llama_local_ds_r1', name: 'Llama Local DeepSeek R1' },
];

export default function Chat() {
  const [selectedModel, setSelectedModel] = useState('llama_local_ds_r1');
  const [enableTools, setEnableTools] = useState(false);

  // Check if the selected model is a local model
  const isLocalModel = selectedModel.includes('local');

  // If local model is selected, we should warn about tool compatibility
  useEffect(() => {
    if (isLocalModel && enableTools) {
      console.warn('Local models may not fully support tools.');
    }
  }, [isLocalModel, enableTools]);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    maxSteps: 15, // Limit the number of steps to 15
    body: {
      modelId: selectedModel,
      disableTools: !enableTools, // Pass the inverse of enableTools
    },
  });

  // Ref for auto-scrolling chat
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  const handleToolsToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnableTools(e.target.checked);
  };

  return (
    <Container pt={15}>
      {/* Chat messages */}
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
                  {formatMessageContent(m.content)}
                </div>

                {m.toolInvocations &&
                  m.toolInvocations.map((toolInvocation: any) => {
                    console.log(toolInvocation);
                    if (
                      toolInvocation.toolName === 'getWeather' &&
                      toolInvocation.result
                    ) {
                      const weatherData =
                        toolInvocation.result as WeatherResult;
                      return (
                        <WeatherCard
                          key={toolInvocation.id}
                          temperature={weatherData.temperature}
                          weathercode={weatherData.weathercode}
                          relativehumidity={weatherData.relativehumidity}
                          city={weatherData.city}
                        />
                      );
                    }
                  })}
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>
      </VStack>

      {/* Chat input */}
      <Box
        flex="1"
        position="fixed"
        bottom={0}
        left={0}
        mb={0}
        width="100%"
        bg="white"
        height="170px"
      >
        <Box
          flex="1"
          position="fixed"
          bottom={0}
          mb={4}
          left="50%"
          transform="translateX(-50%)"
          width="900px"
          bg="white"
          p={4}
          border="1px solid #E2E8F0"
          borderRadius="md"
        >
          <form onSubmit={handleSubmit}>
            <VStack align="normal" w="100%">
              {/* Model Selection and Tools Toggle */}
              <HStack mb={1} gap={4} alignItems="flex-end">
                <Box flex="1">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        margin: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Select AI Model
                    </h4>
                    <select
                      value={selectedModel}
                      onChange={handleModelChange}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #CBD5E0',
                        backgroundColor: 'white',
                      }}
                    >
                      {AVAILABLE_MODELS.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </Box>
                <Box>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={enableTools}
                      onChange={handleToolsToggle}
                      style={{ marginRight: '8px' }}
                    />
                    <span>Enable Tools</span>
                  </label>
                </Box>
              </HStack>

              <HStack mt={4} mb={4}>
                <Input
                  value={input}
                  placeholder="Type a message..."
                  onChange={handleInputChange}
                  bg="white"
                  border="1px solid #CBD5E0"
                  borderRadius="md"
                  _focus={{ borderColor: 'blue.400', boxShadow: 'outline' }}
                />
                <Button type="submit" colorScheme="blue">
                  Send
                </Button>
              </HStack>
            </VStack>
          </form>
        </Box>
      </Box>
    </Container>
  );
}

// Function to parse content and format think blocks
const formatMessageContent = (content: string) => {
  if (!content.includes('<think>')) {
    return <div>{content}</div>;
  }

  // Parse <think> blocks
  const parts = content.split(/(<think>|<\/think>)/);
  const formattedParts = [];
  let isInsideThinkBlock = false;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (part === '<think>') {
      isInsideThinkBlock = true;
      continue;
    } else if (part === '</think>') {
      isInsideThinkBlock = false;
      continue;
    }

    if (part.trim() === '') {
      continue;
    }

    if (isInsideThinkBlock) {
      formattedParts.push(
        <div
          key={i}
          style={{
            padding: '10px 15px',
            margin: '8px 0',
            backgroundColor: '#f8f8f8',
            borderLeft: '4px solid #ccc',
            color: '#666',
            fontStyle: 'italic',
            borderRadius: '0 4px 4px 0',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            Thinking:
          </div>
          {part}
        </div>
      );
    } else {
      formattedParts.push(<div key={i}>{part}</div>);
    }
  }

  return <>{formattedParts}</>;
};
