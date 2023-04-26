import React from "react";
import { Button } from "@chakra-ui/react";

export const LanguageOptionButton = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: string;
  onClick: (name: string) => void;
}) => {
  return (
    <Button
      colorScheme="teal"
      size="xs"
      fontSize="10px"
      background={selected === label ? "teal.900" : "teal.500"}
      _hover={{
        background: selected === label ? "teal.900" : "teal.600",
      }}
      onClick={() => onClick(label)}
    >
      {label}
    </Button>
  );
};
