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
  useEffect(() => {
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
  }, []);

  return (
    <div className={cn(styles.root, className)}>
      <Loader className={styles.loader} />
    </div>
  );
};

export default Initializer;
