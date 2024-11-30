import { useEffect, useState } from 'preact/hooks';
import { Loader } from '../theme';
import styles from './Initializer.module.css';
import cn from '../helpers/classnames';
import { VectorDBStats } from '../helpers/types';
import {
  getInitializeVectorDBFromContent,
  getConversationModeFromContent,
  getLanguageModelAvailabilityInServiceWorker,
} from '../helpers/chromeMessages';
import { TriangleAlert } from 'lucide-react';

const Initializer = ({
  setStats,
  setInitialized,
  setConversationModeActive,
  className = '',
}: {
  setStats: (stats: VectorDBStats) => void;
  setInitialized: (languageModelStatus: AICapabilityAvailability) => void;
  setConversationModeActive: (active: boolean) => void;
  className?: string;
}) => {
  const [error, setError] = useState<string>('');

  const initialize = () =>
    Promise.all([
      getInitializeVectorDBFromContent(),
      getConversationModeFromContent(),
      getLanguageModelAvailabilityInServiceWorker(),
    ]);

  useEffect(() => {
    initialize()
      .then(([vectorDB, conversationMode, availability]) => {
        setStats(vectorDB.dbStats);
        setConversationModeActive(conversationMode);
        if (availability === 'no') {
          setError('The language model is not available in your browser');
        } else {
          setInitialized(availability);
        }
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className={cn(styles.root, className)}>
      {error ? (
        <div className={styles.error}>
          <TriangleAlert className={styles.errorIcon} size="1.5rem" />
          <p className={styles.errorText}>{error}</p>
        </div>
      ) : (
        <Loader className={styles.loader} />
      )}
    </div>
  );
};

export default Initializer;
