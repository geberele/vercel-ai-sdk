import { Box, HStack, Flex, Text, IconButton, Avatar } from '@chakra-ui/react';
import { FaReply, FaRegThumbsUp, FaRegThumbsDown } from 'react-icons/fa';

interface Comment {
  id: number;
  author: {
    name: string;
    initials: string;
    avatarSrc: string;
  };
  timestamp: string;
  content: string;
}

export const Comment = ({ comment }: { comment: Comment }) => {
  return (
    <Box
      border="1px solid #E2E8F0"
      borderRadius="md"
      p={4}
      maxW="xl"
      className="comment"
      margin={4}
    >
      {/* Avatar */}
      <HStack gap="3">
        <Avatar.Root variant={'outline'}>
          <Avatar.Fallback name={comment.author.name} />
        </Avatar.Root>

        {/* Comment Body */}
        <Box flex="1">
          {/* Name and Timestamp */}
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold" className="comment-name">
              {comment.author.name}
            </Text>
            <Text fontSize="sm" color="gray.500" className="comment-timestamp">
              {comment.timestamp}
            </Text>
          </Flex>

          {/* Comment Text */}
          <Text mt={1} fontSize="sm">
            {comment.content}
          </Text>

          {/* Actions */}
          <Flex mt={2} gap={1}>
            <IconButton aria-label="Reply" size="sm" variant="ghost">
              <FaReply />
            </IconButton>

            <IconButton aria-label="Like" size="sm" variant="ghost">
              <FaRegThumbsUp />
            </IconButton>
            <IconButton aria-label="Dislike" size="sm" variant="ghost">
              <FaRegThumbsDown />
            </IconButton>
          </Flex>
        </Box>
      </HStack>
    </Box>
  );
};
