import { render } from 'preact';
import { useState } from 'preact/hooks';
import './styles/reset.css';
import styles from './popup.module.css';
import Initializer from './Initializer';
import App from './App';

const Popup = () => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  return (
    <div className={styles.root}>
      {!initialized && (
        <Initializer
          className={styles.initializer}
          setInitialized={() => setInitialized(true)}
          setTitle={setTitle}
        />
      )}
      <App title={title} />
    </div>
  );
};

render(<Popup />, document.querySelector('#amw-popup-container'));
