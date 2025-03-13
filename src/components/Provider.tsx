'use client';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from '@/styles/theme';

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
};
