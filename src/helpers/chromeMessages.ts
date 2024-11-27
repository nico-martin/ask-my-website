type Actions =
  | {
      action: 'initialize';
      payload: null;
      returns: boolean;
    }
  | {
      action: 'query';
      payload: { query: string };
      returns: Array<{ content: string; id: string }>;
    }
  | {
      action: 'highlight';
      payload: { id: string };
      returns: boolean;
    };

export type ActionNames = Actions['action'];
export type ActionPayload<A extends ActionNames> = Extract<
  Actions,
  { action: A }
>['payload'];
export type ActionReturn<A extends ActionNames> = Extract<
  Actions,
  { action: A }
>['returns'];

export enum ResponseState {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export const sendMessage = <T = {}>(
  action: string,
  payload?: any
): Promise<T> =>
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

/*

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, payload } = message;

  // Define handlers for each action
  const handlers: {
    [A in ActionNames]?: (
      payload: ActionPayload<A>
    ) => ActionReturn<A> | Promise<ActionReturn<A>>;
  } = {
    initialize: () => true,
    query: ({ query }) => [`Result for ${query}`], // Example response
    highlight: ({ id }) => id === 'validId', // Example validation
  };

  // Handle the message
  if (handlers[action as ActionNames]) {
    const handler = handlers[action as ActionNames] as (
      p: typeof payload
    ) => (typeof handlers)[A];
    const result = handler(payload);
    Promise.resolve(result)
      .then(sendResponse)
      .catch((error) => sendResponse({ error: error.message }));
    return true; // Indicate that the response is asynchronous
  }

  sendResponse({ error: 'Unknown action' });
});*/
