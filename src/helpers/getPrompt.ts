const gereatePrompt = (
  documents: Array<string>,
  title: string,
  query: string
) =>
  `INSTRUCTIONS:
DOCUMENT contains parts of the website "{documentTitle}".
Answer the users QUESTION using the DOCUMENT text below.
Keep your answer ground in the facts of the DOCUMENT.
If the DOCUMENT doesn’t contain the facts to answer the QUESTION, say that you can’t answer the question.
Answer in Markdown format

DOCUMENT:
{results}

QUESTION:
{question}`
    .replace('{documentTitle}', title)
    .replace(
      '{results}',
      documents.map((document) => `"${document}"`).join('\n\n')
    )
    .replace('{question}', query);

const getPrompt = async (
  session: AILanguageModel,
  documents: Array<string>,
  title: string,
  query: string,
  log: boolean = false
) => {
  const tokensLeft = session.tokensLeft;
  let valid = false;
  let prompt = '';

  while (!valid) {
    prompt = gereatePrompt(documents, title, query);
    const tokens = await session.countPromptTokens(prompt);
    log && console.log('Prompt tokens:', tokens);
    log && console.log('tokens left:', tokensLeft);
    log && console.log('documents:', documents.length);
    if (tokens < tokensLeft) {
      valid = true;
    } else {
      log && console.log('Prompt too long, retrying');
      documents.pop();
    }
  }

  return prompt;
};

export default getPrompt;
