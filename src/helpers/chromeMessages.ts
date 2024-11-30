import { Source, VectorDBStats } from './types';

const sendMessageToContent = <T = {}>(
  action: string,
  payload?: any
): Promise<T> =>
  new Promise((resolve, reject) => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          const tabId = tabs[0].id;
          // Send a message to the content script of the active tab
          chrome.tabs.sendMessage(tabId, { action, payload }, (response) => {
            resolve(response);
          });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

export const getInitializeVectorDBFromContent = async (): Promise<{
  dbStats: VectorDBStats;
  dbResponse: null;
  documentTitle: string;
}> => {
  return sendMessageToContent<{
    dbStats: VectorDBStats;
    dbResponse: null;
    documentTitle: string;
  }>('queryVectorDB', { query: '' });
};

export const getQueryResponseFromContent = async (
  query: string
): Promise<{
  dbStats: VectorDBStats;
  dbResponse: {
    sources: Array<{ content: string; id: string }>;
    documentParts: Array<string>;
  };
  documentTitle: string;
}> => {
  return sendMessageToContent<{
    dbStats: VectorDBStats;
    dbResponse: {
      sources: Array<{ content: string; id: string }>;
      documentParts: Array<string>;
    };
    documentTitle: string;
  }>('queryVectorDB', { query });
};

export const getConversationModeFromContent = async (): Promise<boolean> =>
  sendMessageToContent<boolean>('conversationMode');

export const setConversationModeFromContent = async (
  active: boolean
): Promise<boolean> =>
  sendMessageToContent<boolean>('conversationMode', active);

export const highlightParagraphFromContent = async (
  id: string
): Promise<void> => {
  return sendMessageToContent<void>('highlight', { id });
};

export const runLanguageModelInServiceWorker = (
  query: string
): Promise<{
  answer: string;
  sources: Array<Source>;
  prompt: string;
}> =>
  new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(
        {
          action: 'runLanguageModel',
          payload: { query },
        },
        (response) => resolve(response)
      );
    } catch (e) {
      reject(e);
    }
  });

export const getLanguageModelAvailabilityInServiceWorker =
  (): Promise<AICapabilityAvailability> =>
    new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(
          {
            action: 'checkLanguageModelAvailability',
          },
          (response) => resolve(response)
        );
      } catch (e) {
        reject(e);
      }
    });

export const runLanguageModelStreamInServiceWorker = (
  query: string,
  callback?: ({
    answer,
    sources,
    prompt,
  }: {
    answer: string;
    sources: Array<Source>;
    prompt: string;
  }) => void
): Promise<{
  answer: string;
  sources: Array<Source>;
  prompt: string;
}> =>
  new Promise((resolve, reject) => {
    try {
      const port = chrome.runtime.connect();
      port.postMessage({
        action: 'runLanguageModelStream',
        payload: { query },
      });
      port.onMessage.addListener(
        (resp: {
          answer: string;
          sources: Array<Source>;
          prompt: string;
          done: boolean;
        }) => {
          callback &&
            callback({
              answer: resp.answer,
              sources: resp.sources,
              prompt: resp.prompt,
            });

          if (resp.done) {
            resolve({
              answer: resp.answer,
              sources: resp.sources,
              prompt: resp.prompt,
            });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
