import renderApp from './App';
import { initializeVectorDB, processQuery } from './db';

let conversationMode = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'initialize') {
    initializeVectorDB().then((stats) =>
      sendResponse({ title: document.title, stats, conversationMode })
    );
  }

  if (message.action === 'query') {
    processQuery(message.payload.query).then((response) => {
      sendResponse(response);
    });
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

  if (message.action === 'conversationMode') {
    const id = 'ask-my-website';
    if (message.payload) {
      renderApp(id);
      conversationMode = true;
    } else {
      const root = document.querySelector(`#${id}`);
      if (root) root.remove();
      conversationMode = false;
    }
  }
  return true;
});
