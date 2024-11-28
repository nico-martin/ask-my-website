import { renderApp, removeApp } from './App';
import { initializeVectorDB, processQuery } from './db';
import highlightParagraph from '../helpers/highlightParagraph';

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
    highlightParagraph(message.payload.id);
    sendResponse();
  }

  if (message.action === 'conversationMode') {
    const id = 'ask-my-website';
    if (message.payload) {
      renderApp(id);
      conversationMode = true;
    } else {
      removeApp(id);
      conversationMode = false;
    }
  }
  return true;
});
