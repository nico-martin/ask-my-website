import { Fragment } from 'preact';
import Form from './App/Form';
import Result from './App/Result';

import styles from './App.module.css';
import { sendMessage } from '../helpers/chromeMessages';
import { useState } from 'preact/hooks';

const App = ({ title }: { title: string }) => {
  const [answer, setAnswer] = useState<string>('');
  const [sources, setSources] = useState<
    Array<{ content: string; id: string }>
  >([]);

  const onSubmit = async (query: string) => {
    const { sources, documentParts } = await sendMessage<{
      sources: Array<{ content: string; id: string }>;
      documentParts: Array<string>;
    }>('query', {
      query,
    });

    const session = await self.ai.languageModel.create({
      systemPrompt: 'You are a helpful AI assistant.',
    });

    const prompt = `INSTRUCTIONS:
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
        documentParts.map((document) => `"${document}"`).join('\n\n')
      )
      .replace('{question}', query);

    console.log(prompt);

    const stream = session.promptStreaming(prompt);
    let answer = '';
    // @ts-ignore
    for await (const chunk of stream) {
      answer = chunk;
      setAnswer(answer);
    }
    setSources(sources);
  };

  return (
    <div className={styles.root}>
      <Form className={styles.form} onSubmit={onSubmit} />
      <Result className={styles.result} answer={answer} sources={sources} />
    </div>
  );
};

export default App;
