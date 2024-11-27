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
