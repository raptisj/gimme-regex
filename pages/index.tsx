import React from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Box, Button, HStack, Input, Text, Flex } from "@chakra-ui/react";
import { Loader } from "../components";
import {
  PatternPreview,
  ContentPreview,
  LanguageOptionButton,
} from "../components";
import { remark } from "remark";
import html from "remark-html";

const inter = Inter({ subsets: ["latin"] });

const supportedLanguages = [
  "JavaScript",
  "Python",
  "Golang",
  "Java 8",
  "Rust",
  "PCRE2(PHP >=7.3)",
  "PCRE(PHP <7.3)",
];

const initialResultState = {
  query: "",
  result: {
    text: "",
    contentHtml: "",
  },
  isRegexType: false,
};

export default function Home() {
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
          <Text maxW="490px">
            Describe a regex pattern you are looking or paste a pattern to get
            the explanation of it
          </Text>

          <Box mt={6}>
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
              <Flex mt={16} flexDirection={"column"}>
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
      </main>
    </>
  );
}
