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
      max_tokens: 80,
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