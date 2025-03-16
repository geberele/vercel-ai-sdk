import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const FormWrapper = ({ children }: { children: ReactNode }) => {
  return (
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
        {children}
      </Box>
    </Box>
  );
};
