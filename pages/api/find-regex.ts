import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);

const generateResult = async ({ query, language = 'JavaScript' }: { query: string, language?: string }) => {
  const promptByWord = `You have to find the proper ${language} regex pattern based on the following description. ${query}. Please provide one example in code.`;
  const promptByPattern = `Give a two sentence explanation of the following ${language} regex pattern: ${query}`;

  try {
    const regex = new RegExp("^/");
    const isRegexType = regex.test(query);

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: isRegexType ? promptByPattern : promptByWord,
      max_tokens: 100,
      temperature: 0,
      n: 1,
    });

    return {
      query,
      result: completion.data.choices[0],
      isRegexType,
    };
  } catch (err) {
    console.error(err);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, language } = req.body;
  const result = await generateResult({ query, language });

  res.status(200).json({ data: result });
}

// const question = "replace all - from a string with spaces";
// const pattern = "/^hello/";
// find the best email validation regex
//
// find the 100 most searched google questions about JavaScript regex patterns
//
// passoword validation that starts with either an underscore or asterisk, followed by at least 5 digits, followed by least 4 letters. It must contain uppercase letters, lowercase letters. It should exclude @ symbols. It must exclude the following characters: - ( ) ;.
//
//
// Email validation
// URL validation
// Password validation
// Phone number validation
// Credit card number validation
// Date validation
// Time validation
// Numeric input validation
// Alphabetic input validation
// Alphanumeric input validation
// String length validation
// Extracting a substring from a larger string
// Replacing text in a string
// Removing whitespace from a string
// Matching a specific word in a string
// Matching a pattern in a string
// Matching a sequence of characters in a string
// Matching a string containing a certain set of characters
// Matching a string starting with a certain set of characters
// Matching a string ending with a certain set of characters
// Matching a string containing any digit
// Matching a string containing any non-digit
// Matching a string containing any whitespace character
// Matching a string containing any non-whitespace character
// Matching a string containing any lowercase letter
// Matching a string containing any uppercase letter
// Matching a string containing any letter
// Matching a string containing any non-letter character
// Matching a string containing any character except a certain set of characters
// Matching a string containing any character except a certain set of characters at the beginning of the string
// Matching a string containing any character except a certain set of characters at the end of the string
// Matching a string containing a certain number of digits
// Matching a string containing a certain number of non-digits
// Matching a string containing a certain number of characters
// Matching a string containing a certain number of non-characters
// Matching a string containing a certain number of specific characters
// Matching a string containing a certain number of non-specific characters
// Matching a string containing a certain pattern of characters
// Matching a string containing a certain pattern of digits
// Matching a string containing a certain pattern of non-digits
// Matching a string containing a certain pattern of whitespace characters
// Matching a string containing a certain pattern of non-whitespace characters
// Matching a string containing a certain pattern of word characters
// Matching a string containing a certain pattern of non-word characters
// Matching a string containing a certain pattern of alphabetic characters
// Matching a string containing a certain pattern of non-alphabetic characters
// Matching a string containing a certain pattern of uppercase letters
// Matching a string containing a certain pattern of lowercase letters
// Matching a string containing a certain pattern of special characters
// Matching a string containing a certain pattern of non-special characters.
