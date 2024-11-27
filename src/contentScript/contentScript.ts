import extractWebsiteParts, { Part } from '../helpers/extractWebsiteParts';
import VectorDB from '../helpers/VectorDB';
import { VectorDBStats } from '../helpers/types';

const db = new VectorDB<Part>();
let initialized = null;

const initializeVectorDB = async (): Promise<VectorDBStats> => {
  if (initialized) return initialized;

  const main = document.querySelector('main') || document.querySelector('body');
  const parsedContent = extractWebsiteParts(main);
  const onlyParagraphs = parsedContent.filter((part) => part.tagName === 'p');
  await db.setModel();
  await db.addEntries(
    onlyParagraphs.map((part) => ({ str: part.content, metadata: part }))
  );
  initialized = {
    parsedCharacters: parsedContent.reduce(
      (acc, curr) => acc + curr.content.length,
      0
    ),
    entries: db.entries.length,
    sections: parsedContent
      .map((content) => content.sectionId)
      .filter((value, index, array) => array.indexOf(value) === index).length,
  };
  return initialized;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'initialize') {
    initializeVectorDB().then((stats) =>
      sendResponse({ title: document.title, stats })
    );
  }

  if (message.action === 'query') {
    db.search(message.payload.query, 7, 0.5).then((results) => {
      const sources = results
        .map((result) => ({
          content: result[0].metadata.content,
          id: result[0].metadata.id,
        }))
        .filter((source) => Boolean(source.content));

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
