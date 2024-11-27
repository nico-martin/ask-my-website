import { useEffect, useState, useRef } from 'preact/hooks';
import { sendMessage } from '../helpers/chromeMessages';
import { Loader } from '../theme';
import styles from './Initializer.module.css';

const Initializer = ({
  setTitle,
  setInitialized,
}: {
  setTitle: (title: string) => void;
  setInitialized: () => void;
}) => {
  useEffect(() => {
    sendMessage<string>('initialize').then((title) => {
      setInitialized();
      setTitle(title);
    });
  }, []);

  return <Loader className={styles.root} />;
};

export default Initializer;
