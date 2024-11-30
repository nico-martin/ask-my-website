import Form from './App/Form';
import Result from './App/Result';

import styles from './App.module.css';
import { sendMessage } from '../helpers/chromeMessages';
import { useState } from 'preact/hooks';
import getPrompt from '../helpers/getPrompt';
import { VectorDBStats } from '../helpers/types';
import Footer from './App/Footer';

const App = ({
  title,
  stats,
  conversationModeActive,
}: {
  title: string;
  stats: VectorDBStats;
  conversationModeActive: boolean;
}) => {
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

    const prompt = await getPrompt(session, documentParts, title, query);

    console.log(prompt);

    const stream = session.promptStreaming(prompt);
    let answer = '';
    // @ts-ignore
    for await (const chunk of stream) {
      answer = chunk;
      setAnswer(answer);
    }

    setSources(sources.filter((source) => prompt.includes(source.content)));
  };

  return (
    <div className={styles.root}>
      <Form className={styles.form} onSubmit={onSubmit} />
      {answer !== '' ? (
        <Result className={styles.result} answer={answer} sources={sources} />
      ) : stats ? (
        <p className={styles.stats}>
          The document has been parsed and{' '}
          <span>
            {new Intl.NumberFormat('de-CH').format(stats.parsedCharacters)}
          </span>{' '}
          characters in{' '}
          <span>{new Intl.NumberFormat('de-CH').format(stats.sections)}</span>{' '}
          sections were transformed into{' '}
          <span>{new Intl.NumberFormat('de-CH').format(stats.entries)}</span>{' '}
          vector embeddings and successfully added to the vector database.
        </p>
      ) : null}
      <Footer
        className={styles.footer}
        conversationModeActive={conversationModeActive}
      />
    </div>
  );
};

export default App;
