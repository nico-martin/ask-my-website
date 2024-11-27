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

  return (
    <div className={styles.root}>
      {!initialized && (
        <Initializer
          className={styles.initializer}
          setInitialized={() => setInitialized(true)}
          setTitle={setTitle}
          setStats={setStats}
        />
      )}
      <App title={title} stats={stats} />
    </div>
  );
};

render(<Popup />, document.querySelector('#amw-popup-container'));
