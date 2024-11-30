import { useEffect, useState } from 'preact/hooks';
import { Loader } from '../theme';
import styles from './Initializer.module.css';
import cn from '../helpers/classnames';
import { VectorDBStats } from '../helpers/types';
import {
  getInitializeVectorDBFromContent,
  getConversationModeFromContent,
} from '../helpers/chromeMessages';
import { TriangleAlert } from 'lucide-react';

const Initializer = ({
  setStats,
  setInitialized,
  setConversationModeActive,
  className = '',
}: {
  setStats: (stats: VectorDBStats) => void;
  setInitialized: () => void;
  setConversationModeActive: (active: boolean) => void;
  className?: string;
}) => {
  const [error, setError] = useState<string>('');
  const initialize = () =>
    Promise.all([
      getInitializeVectorDBFromContent(),
      getConversationModeFromContent(),
    ]).then(([vectorDB, conversationMode]) => {
      setStats(vectorDB.dbStats);
      setConversationModeActive(conversationMode);
    });

  useEffect(() => {
    initialize()
      .then(() => setInitialized())
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
