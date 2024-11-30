import { renderApp, removeApp } from './App';
import { initializeVectorDB, processQuery } from './db';
import highlightParagraph from '../helpers/highlightParagraph';
import { VectorDBStats } from '../helpers/types';

let conversationMode = false;

const searchForQuery = async (
  query: string = null
): Promise<{
  dbStats: VectorDBStats;
  dbResponse: {
    sources: Array<{ content: string; id: string }>;
    documentParts: Array<string>;
  };
  documentTitle: string;
}> => {
  const dbStats = await initializeVectorDB();
  const dbResponse = query ? await processQuery(query) : null;
  return { dbStats, dbResponse, documentTitle: document.title };
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'queryVectorDB') {
    searchForQuery(message?.payload?.query || '').then((resp) =>
      sendResponse(resp)
    );
  }

  if (message.action === 'highlight') {
    highlightParagraph(message.payload.id);
    sendResponse();
  }

  if (message.action === 'conversationMode') {
    const id = 'ask-my-website';
    if (message.payload === true) {
      renderApp(id);
      conversationMode = true;
    } else if (message.payload === false) {
      removeApp(id);
      conversationMode = false;
    }
    sendResponse(conversationMode);
  }
  return true;
});
