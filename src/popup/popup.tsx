import { render } from 'preact';
import { useState } from 'preact/hooks';
import './styles/reset.css';
import './styles/typography.css';
import styles from './popup.module.css';
import Initializer from './Initializer';
import App from './App';
import { VectorDBStats } from '../helpers/types';

const Popup = () => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [stats, setStats] = useState<VectorDBStats>(null);
  const [conversationModeActive, setConversationModeActive] =
    useState<boolean>(false);

  return (
    <div className={styles.root}>
      {!initialized && (
        <Initializer
          className={styles.initializer}
          setInitialized={() => setInitialized(true)}
          setTitle={setTitle}
          setStats={setStats}
          setConversationModeActive={setConversationModeActive}
        />
      )}
      <App
        title={title}
        stats={stats}
        conversationModeActive={conversationModeActive}
      />
    </div>
  );
};

render(<Popup />, document.querySelector('#amw-popup-container'));
