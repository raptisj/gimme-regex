import React from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { remark } from "remark";
import html from "remark-html";
import {
  useDisclosure,
  Box,
  Button,
  HStack,
  Input,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Loader } from "../components";
import {
  PatternPreview,
  ContentPreview,
  LanguageOptionButton,
} from "../components";
import { supportedLanguages, commonQuestions } from "../constants";

const inter = Inter({ subsets: ["latin"] });

const initialResultState = {
  query: "",
  result: {
    text: "",
    contentHtml: "",
  },
  isRegexType: false,
};

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [finalResult, setFinalResult] = React.useState(initialResultState);
  const [question, setQuestion] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [languageSearch, setLanguageSearch] = React.useState("JavaScript");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    setFinalResult(initialResultState);
    setLoading(true);

    const res = await fetch("/api/find-regex", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: searchQuery,
        language: languageSearch,
      }),
    });
    setLoading(false);

    const { data } = await res.json();

    const processedContent = await remark().use(html).process(data.result.text);
    const contentHtml = processedContent.toString();

    setQuestion(searchQuery);
    setFinalResult({
      ...data,
      result: { ...data.result, contentHtml },
    });
    setSearchQuery("");
  };

  const { result, isRegexType, query } = finalResult;

  const onLookupClick = (val: string) => {
    setSearchQuery(val);
    onClose();
  };

  return (
    <>
      <Head>
        <title>Gimme Regex</title>
        <meta
          name="description"
          content="Describe a regex pattern you are looking or paste a pattern to get the explanation of it"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${styles.main} ${inter.className}`}>
        <Box maxW="490px">
          <h1>_ _Gimme_Regex__</h1>
          <Text>
            Describe a regex pattern you are looking or paste a pattern to get
            the explanation of it
          </Text>

          <Box mt={6}>
            <Flex justifyContent="space-between">
              <Flex mb={2} flexWrap="wrap" maxWidth="260px" gap="4px">
                {supportedLanguages.map((s) => (
                  <LanguageOptionButton
                    key={s}
                    label={s}
                    selected={languageSearch}
                    onClick={setLanguageSearch}
                  />
                ))}
              </Flex>
              <Button size="xs" fontSize="10px" onClick={onOpen}>
                common lookups
              </Button>
            </Flex>
            <form onSubmit={handleSubmit}>
              <HStack spacing={2}>
                <Input
                  placeholder="type words or patterns . . ."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                />
                <Button type="submit">submit</Button>
              </HStack>
            </form>

            {loading && (
              <Flex padding={20} justifyContent="center">
                <Loader />
              </Flex>
            )}

            {result.text && (
              <Flex mt={16} flexDirection="column">
                {isRegexType ? (
                  <>
                    <PatternPreview result={query} />

                    <ContentPreview
                      content={result.text}
                      label="Description:"
                      mt={6}
                    />
                  </>
                ) : (
                  <>
                    <ContentPreview content={question} label="Query:" mt={4} />

                    <PatternPreview result={result.contentHtml} />
                  </>
                )}
              </Flex>
            )}
          </Box>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader pb={0}>Common lookups</ModalHeader>
            <Text padding="0 0 16px 40px" fontStyle="italic">
              ...as suggested by ChatGPT{" "}
              <Text fontStyle="initial" as="span">
                🙃
              </Text>
            </Text>
            <ModalCloseButton />
            <ModalBody
              maxH="70vh"
              overflow="auto"
              background="#fbfbfb"
              borderRadius={5}
              p={0}
            >
              {commonQuestions.map((q) => (
                <Text
                  key={q.question}
                  padding="4px 24px"
                  cursor="pointer"
                  _hover={{
                    background: "#f2f2f2",
                  }}
                  onClick={() => onLookupClick(q.question)}
                >
                  - {q.question}
                </Text>
              ))}
            </ModalBody>
          </ModalContent>
        </Modal>
      </main>
    </>
  );
}
