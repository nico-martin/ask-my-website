import VectorDB from '../helpers/VectorDB';
import extractWebsiteParts, { Part } from '../helpers/extractWebsiteParts';
import { VectorDBStats } from '../helpers/types';

const db = new VectorDB<Part>();
let initialized = null;

export const initializeVectorDB = async (): Promise<VectorDBStats> => {
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

export const processQuery = async (
  query: string
): Promise<{
  sources: Array<{ content: string; id: string }>;
  documentParts: Array<string>;
}> => {
  const results = await db.search(query, 7, 0.5);

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

  return { sources, documentParts };
};
