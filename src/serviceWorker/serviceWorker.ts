import getPrompt from '../helpers/getPrompt';
import { getQueryResponseFromContent } from '../helpers/chromeMessages';
import { Source } from '../helpers/types';

const runLanguageModel = async (
  query: string,
  callback?: ({
    answer,
    sources,
    prompt,
  }: {
    answer: string;
    sources: Array<Source>;
    prompt: string;
  }) => void
): Promise<{
  answer: string;
  sources: Array<Source>;
  prompt: string;
}> => {
  const { dbResponse, documentTitle } =
    await getQueryResponseFromContent(query);

  const session: AILanguageModel =
    // @ts-ignore
    await chrome.aiOriginTrial.languageModel.create({
      systemPrompt: 'You are a helpful AI assistant.',
    });

  const prompt = await getPrompt(
    session,
    dbResponse.documentParts,
    documentTitle,
    query
  );

  console.log(prompt);

  const stream = session.promptStreaming(prompt);
  let answer = '';
  // @ts-ignore
  for await (const chunk of stream) {
    answer = chunk;
    callback &&
      callback({
        answer,
        sources: dbResponse.sources.filter((source) =>
          prompt.includes(source.content)
        ),
        prompt,
      });
  }

  return {
    answer,
    sources: dbResponse.sources.filter((source) =>
      prompt.includes(source.content)
    ),
    prompt,
  };
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'runLanguageModel') {
    const query = request.payload.query;
    runLanguageModel(query).then((response) => sendResponse(response));
  }
  return true;
});

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((request) => {
    if (request.action === 'runLanguageModelStream') {
      const query = request.payload.query;
      runLanguageModel(query, (response) => {
        port.postMessage({ ...response, done: false });
      }).then((response) => {
        port.postMessage({ ...response, done: true });
        port.disconnect();
      });
    }
  });
});
