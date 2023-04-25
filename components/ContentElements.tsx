import React from "react";
import { Box, Text, BoxProps } from "@chakra-ui/react";

export const PatternPreview = ({ result }: { result: string }) => {
  return (
    <Box mt={4}>
      <Text fontWeight="bold">Pattern:</Text>
      <Box background="#011627" borderRadius={6} color="wheat" padding={4}>
        <div dangerouslySetInnerHTML={{ __html: result }} />
      </Box>
    </Box>
  );
};

export const ContentPreview = ({
  content,
  label,
  ...rest
}: {
  content: string;
  label: string;
} & BoxProps) => {
  return (
    <Box {...rest}>
      <Text fontWeight="bold">{label}</Text>
      <Text fontSize="lg" fontStyle="italic">
        {content}
      </Text>
    </Box>
  );
};
