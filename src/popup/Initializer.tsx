import { useEffect, useState, useRef } from 'preact/hooks';
import { sendMessage } from '../helpers/chromeMessages';
import { Loader } from '../theme';
import styles from './Initializer.module.css';
import cn from '../helpers/classnames';

const Initializer = ({
  setTitle,
  setInitialized,
  className = '',
}: {
  setTitle: (title: string) => void;
  setInitialized: () => void;
  className?: string;
}) => {
  useEffect(() => {
    sendMessage<string>('initialize').then((title) => {
      setInitialized();
      setTitle(title);
    });
  }, []);

  return (
    <div className={cn(styles.root, className)}>
      <Loader className={styles.loader} />
    </div>
  );
};

export default Initializer;
