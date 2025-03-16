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

import { Messages } from '../../components/Messages';
import { FormWrapper } from '../../components/FormWrapper';

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
    maxSteps: 15, // Limit the number of steps for the LLM to 15
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
      <Messages messages={messages} />
      <div ref={messagesEndRef} />

      {/* Chat input */}
      <FormWrapper>
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
      </FormWrapper>
    </Container>
  );
}
