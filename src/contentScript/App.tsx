import { render, createElement } from 'preact';
import { FileQuestion, Ear, Volume2 } from 'lucide-react';
import { useState, useEffect } from 'preact/hooks';
import { Loader } from '../theme';
import styles from './App.module.css';
import SpeechToText from '../helpers/SpeechToText';
import textToSpeech from '../helpers/textToSpeech';
import { processQuery } from './db';
import getPrompt from '../helpers/getPrompt';

enum State {
  IDLE,
  LISTENING,
  THINKING,
  SPEAKING,
}

const ICON_SIZE = 40;

const App = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [state, setState] = useState<State>(State.IDLE);

  useEffect(() => {
    const speechToText = new SpeechToText();
    let started = false;

    const keydown = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
      }
      if (
        (event.code === 'Space' || event.key === ' ') &&
        !started &&
        (event.target as HTMLTextAreaElement)?.type !== 'textarea'
      ) {
        setState(State.LISTENING);
        speechToText.start();
        started = true;
      }
    };
    const keyup = async (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.key === ' ') {
        started = false;
        const text = await speechToText.stop();
        setState(State.THINKING);
        try {
          const results = await processQuery(text);
          const session = await self.ai.languageModel.create({
            systemPrompt: 'You are a helpful AI assistant.',
          });

          const prompt = await getPrompt(
            session,
            results.documentParts,
            document.title,
            text
          );
          console.log(prompt);
          const answer = await session.prompt(prompt);
          setState(State.SPEAKING);
          await textToSpeech(answer);
          setState(State.IDLE);
        } catch (e) {
          setState(State.SPEAKING);
          await textToSpeech('Sorry, I could not understand that');
          setState(State.IDLE);
        }
      }
    };

    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);

    return () => {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('keyup', keyup);
    };
  }, []);

  return (
    <div className={styles.root}>
      <button
        style={{ width: ICON_SIZE * 1.7, height: ICON_SIZE * 1.7 }}
        className={styles.button}
        onClick={() => setVisible((v) => !v)}
      >
        {state === State.IDLE ? (
          <FileQuestion size={ICON_SIZE} />
        ) : state === State.LISTENING ? (
          <Ear size={ICON_SIZE} />
        ) : state === State.THINKING ? (
          <span
            style={{
              position: 'relative',
              display: 'inline-block',
              width: ICON_SIZE,
              height: ICON_SIZE,
            }}
          >
            <Loader
              style={{
                fontSize: ICON_SIZE,
                display: 'block',
                left: '50%',
                top: '50%',
                position: 'absolute',
              }}
            />
          </span>
        ) : state === State.SPEAKING ? (
          <Volume2 size={ICON_SIZE} />
        ) : null}
      </button>
    </div>
  );
};

const renderApp = (id: string) => {
  const root = document.createElement('div');
  root.id = id;
  document.body.appendChild(root);
  root && render(createElement(App, {}), root);
};

export default renderApp;
