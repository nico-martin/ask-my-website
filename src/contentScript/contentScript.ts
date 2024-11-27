import extractWebsiteParts, { Part } from '../helpers/extractWebsiteParts';
import VectorDB from '../helpers/VectorDB';
import {
  ActionNames,
  ActionPayload,
  ActionReturn,
  ResponseState,
} from '../helpers/chromeMessages';

const db = new VectorDB<Part>();

const initializeVectorDB = async () => {
  const main = document.querySelector('main') || document.querySelector('body');
  const parsedContent = extractWebsiteParts(main);
  const onlyParagraphs = parsedContent.filter((part) => part.tagName === 'p');
  await db.setModel();
  await db.addEntries(
    onlyParagraphs.map((part) => ({ str: part.content, metadata: part }))
  );
};
/*
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, payload } = message;

  const handlers: {
    [A in ActionNames]?: (
      payload: ActionPayload<A>
    ) => Promise<ActionReturn<A>>;
  } = {
    initialize: async () => {
      await initializeVectorDB();
      return true;
    },
    query: async ({ query }) => {
      const results = await db.search(message.payload.query, 5, 0.75);
      return results.map((result) => ({
        content: result[0].metadata.content,
        id: result[0].metadata.id,
      }));
    },
    highlight: async ({ id }) => {
      const highlighted = document.querySelectorAll(
        '[data-vectordb-highlighted]'
      );
      highlighted.forEach((element) => {
        (element as HTMLElement).style.backgroundColor = '';
        element.removeAttribute('data-vectordb-highlighted');
      });
      const element: HTMLElement = document.querySelector(
        `[data-vectordb-id="${message.payload.id}"]`
      );
      if (element) {
        const rect = element.getBoundingClientRect();
        const top = rect.top + window.scrollY - window.innerHeight / 2;
        window.scrollTo({
          top,
          behavior: 'smooth',
        });
        element.style.backgroundColor = 'yellow';
        element.setAttribute('data-vectordb-highlighted', 'true');
      }
      return true;
    },
  };

  if (handlers[action as ActionNames]) {
    const handler = handlers[action as ActionNames] as (
      p: typeof payload
      // @ts-ignore
    ) => (typeof handlers)[A];

    handler(payload)
      .then((resp) =>
        sendResponse({ state: ResponseState.SUCCESS, payload: resp })
      )
      .catch(() => sendResponse({ state: ResponseState.ERROR }));
  } else {
    sendResponse({ state: ResponseState.ERROR });
  }
});*/

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'initialize') {
    initializeVectorDB().then(() => sendResponse());
  }

  if (message.action === 'query') {
    db.search(message.payload.query, 5, 0.75).then((results) =>
      sendResponse(
        results.map((result) => ({
          content: result[0].metadata.content,
          id: result[0].metadata.id,
        }))
      )
    );
  }

  if (message.action === 'highlight') {
    const highlighted = document.querySelectorAll(
      '[data-vectordb-highlighted]'
    );
    highlighted.forEach((element) => {
      (element as HTMLElement).style.backgroundColor = '';
      element.removeAttribute('data-vectordb-highlighted');
    });
    const element: HTMLElement = document.querySelector(
      `[data-vectordb-id="${message.payload.id}"]`
    );
    if (element) {
      const rect = element.getBoundingClientRect();
      const top = rect.top + window.scrollY - window.innerHeight / 2;
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
      element.style.backgroundColor = 'yellow';
      element.setAttribute('data-vectordb-highlighted', 'true');
    }
    sendResponse();
  }
  return true;
});
