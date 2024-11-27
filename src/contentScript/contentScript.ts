import extractWebsiteParts, { Part } from '../helpers/extractWebsiteParts';
import VectorDB from '../helpers/VectorDB';

const db = new VectorDB<Part>();
let initialized = false;

const initializeVectorDB = async () => {
  if (initialized) return;

  const main = document.querySelector('main') || document.querySelector('body');
  const parsedContent = extractWebsiteParts(main);
  const onlyParagraphs = parsedContent.filter((part) => part.tagName === 'p');
  await db.setModel();
  await db.addEntries(
    onlyParagraphs.map((part) => ({ str: part.content, metadata: part }))
  );
  initialized = true;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'initialize') {
    initializeVectorDB().then(() => sendResponse(document.title));
  }

  if (message.action === 'query') {
    db.search(message.payload.query, 5, 0.75).then((results) => {
      const sources = results.map((result) => ({
        content: result[0].metadata.content,
        id: result[0].metadata.id,
      }));

      const sections = results
        .map((result) => result[0].metadata.sectionId)
        .filter((value, index, array) => array.indexOf(value) === index);

      const dbEntries = sections.map((section) =>
        db.entries.filter((entry) => entry.metadata.sectionId === section)
      );

      const documentParts: Array<string> = dbEntries.map((entries) =>
        entries
          .filter((entry) => Boolean(entry.metadata.content))
          .map((entry) => entry.metadata.content)
          .join('\n')
      );

      sendResponse({ sources, documentParts });
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
  return true;
});
