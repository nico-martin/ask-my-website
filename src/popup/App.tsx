import Form from './App/Form';
import Result from './App/Result';
import styles from './App.module.css';
import { useState } from 'preact/hooks';
import { VectorDBStats } from '../helpers/types';
import Footer from './App/Footer';
import { runLanguageModelStreamInServiceWorker } from '../helpers/chromeMessages';

const App = ({
  stats,
  conversationModeActive,
}: {
  stats: VectorDBStats;
  conversationModeActive: boolean;
}) => {
  const [answer, setAnswer] = useState<string>('');
  const [sources, setSources] = useState<
    Array<{ content: string; id: string }>
  >([]);

  const onSubmit = async (query: string) => {
    const done = await runLanguageModelStreamInServiceWorker(query, (resp) => {
      setAnswer(resp.answer);
      setSources(resp.sources);
    });
    setAnswer(done.answer);
    setSources(done.sources);
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
