import { render } from 'preact';
import { useRef, useState } from 'preact/hooks';
import './styles/reset.css';
import './styles/typography.css';
import styles from './popup.module.css';
import Initializer from './Initializer';
import App from './App';
import { VectorDBStats } from '../helpers/types';

const Popup = () => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [stats, setStats] = useState<VectorDBStats>(null);
  const [languageModelStatus, setLanguageModelStatus] =
    useState<AICapabilityAvailability>(null);
  const [conversationModeActive, setConversationModeActive] =
    useState<boolean>(false);
  const rootRef = useRef<HTMLDivElement>();

  return (
    <div className={styles.root} ref={rootRef}>
      {!initialized && (
        <Initializer
          className={styles.initializer}
          setInitialized={(languageModelStatus: AICapabilityAvailability) => {
            setLanguageModelStatus(languageModelStatus);
            setInitialized(true);
          }}
          setStats={setStats}
          setConversationModeActive={setConversationModeActive}
        />
      )}
      <App
        stats={stats}
        languageModelStatus={languageModelStatus}
        conversationModeActive={conversationModeActive}
      />
    </div>
  );
};

render(<Popup />, document.querySelector('#amw-popup-container'));
