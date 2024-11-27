import { Fragment } from 'preact';
import Form from './App/Form';
import Result from './App/Result';

import styles from './App.module.css';
import { sendMessage } from '../helpers/chromeMessages';
import { useState } from 'preact/hooks';

const App = ({ title }: { title: string }) => {
  const [answer, setAnswer] = useState<string>('');
  const [results, setResults] = useState<
    Array<{ content: string; id: string }>
  >([]);

  const onSubmit = async (query: string) => {
    const data = await sendMessage<Array<{ content: string; id: string }>>(
      'query',
      {
        query,
      }
    );

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
        data.map((result) => `"${result.content}"`).join('\n\n')
      )
      .replace('{question}', query);

    const stream = session.promptStreaming(prompt);
    let answer = '';
    // @ts-ignore
    for await (const chunk of stream) {
      answer = chunk;
      setAnswer(answer);
    }
    setResults(data);
  };

  return (
    <div className={styles.root}>
      <Form className={styles.form} onSubmit={onSubmit} />
      {answer !== '' && (
        <Result className={styles.result} answer={answer} results={results} />
      )}
    </div>
  );
};

export default App;
