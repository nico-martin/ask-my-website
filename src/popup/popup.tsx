import { Fragment, render } from 'preact';
import { useEffect, useState, useRef } from 'preact/hooks';
import { VectorizedEntry } from '../helpers/VectorDB';
import { Part } from '../helpers/extractWebsiteParts';
import showdown from 'showdown';

const showdownConverter = new showdown.Converter();

const sendMessage = <T = {},>(action: string, payload?: any): Promise<T> =>
  new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const tabId = tabs[0].id;
        // Send a message to the content script of the active tab
        chrome.tabs.sendMessage(tabId, { action, payload }, (response) => {
          resolve(response);
        });
      }
    });
  });

const App = () => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const textRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<
    Array<{ content: string; id: string }>
  >([]);
  const [answer, setAnswer] = useState<string>('');

  return initialized ? (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const query = textRef.current.value;
          sendMessage<Array<{ content: string; id: string }>>('query', {
            query,
          }).then(async (data) => {
            setResults(data);
            const session = await self.ai.languageModel.create({
              systemPrompt: 'You are a helpful AI assistant.',
            });

            const prompt = `INSTRUCTIONS:
DOCUMENT contains parts of the website.
Answer the users QUESTION using the DOCUMENT text below.
Keep your answer ground in the facts of the DOCUMENT.
If the DOCUMENT doesn’t contain the facts to answer the QUESTION, say that you can’t answer the question.
Answer in Markdown format

DOCUMENT:
{results}

QUESTION:
{question}`
              //.replace('{documentTitle}', pdfTitle)
              .replace(
                '{results}',
                data.map((result) => `"${result.content}"`).join('\n\n')
              )
              .replace('{question}', query);
            const stream = session.promptStreaming(prompt);
            let answer = '';
            for await (const chunk of stream) {
              answer = chunk;
              setAnswer(answer);
            }
          });
        }}
      >
        <label>
          Question:
          <input
            defaultValue="how many cantons does switzerland have?"
            type="text"
            ref={textRef}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <div
        dangerouslySetInnerHTML={{
          __html: showdownConverter.makeHtml(answer),
        }}
      />
      <ul>
        {results.map((result) => (
          <li>
            <button
              onClick={async () => {
                await sendMessage('highlight', {
                  id: result.id,
                });
              }}
            >
              {result.content.substring(0, 50)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <button
      onClick={async () =>
        sendMessage('initialize').then(() => setInitialized(true))
      }
    >
      Initialize
    </button>
  );
};

render(<App />, document.querySelector('#amw-popup-container'));
