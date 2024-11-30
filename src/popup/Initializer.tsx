import { useEffect, useState, useRef } from 'preact/hooks';
import { sendMessage } from '../helpers/chromeMessages';
import { Loader } from '../theme';
import styles from './Initializer.module.css';
import cn from '../helpers/classnames';
import { VectorDBStats } from '../helpers/types';

const Initializer = ({
  setTitle,
  setStats,
  setInitialized,
  setConversationModeActive,
  className = '',
}: {
  setTitle: (title: string) => void;
  setStats: (stats: VectorDBStats) => void;
  setInitialized: () => void;
  setConversationModeActive: (active: boolean) => void;
  className?: string;
}) => {
  const initialize = () =>
    sendMessage<{
      title: string;
      stats: VectorDBStats;
      conversationMode: boolean;
    }>('initialize').then(({ title, stats, conversationMode }) => {
      setInitialized();
      setTitle(title);
      setStats(stats);
      setConversationModeActive(conversationMode);
    });

  const tryInitialize = async () => {
    let init = false;
    while (!init) {
      try {
        await initialize();
        init = true;
      } catch (e) {
        console.error(e);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };

  useEffect(() => {
    tryInitialize();
  }, []);

  return (
    <div className={cn(styles.root, className)}>
      <Loader className={styles.loader} />
    </div>
  );
};

export default Initializer;
