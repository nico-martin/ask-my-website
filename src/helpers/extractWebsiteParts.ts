const cleanHtmlContent = (htmlContent: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const elements = Array.from(
    doc.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, td')
  );

  return elements.map((el) => el.outerHTML).join('\n');
};

export interface Part {
  tagName: string;
  paragraphId: number;
  sectionId: number;
  id: string;
  content: string;
  sentences: string[];
}

const extractWebsiteParts = (rootElement: HTMLElement): Array<Part> => {
  const elements = Array.from(
    rootElement.querySelectorAll('h1, h2, h3, h4, h5, h6, p')
  );

  const result: Array<Part> = [];
  let currentSectionId: number = 0;
  let currentPartId: number = 0;

  elements.map((element, index) => {
    currentPartId++;
    if (/^h[1-6]$/i.test(element.tagName)) {
      currentSectionId++;
      currentPartId = 0;
    }

    const id = `${currentSectionId}-${currentPartId}`;
    element.setAttribute('data-vectordb-id', id);

    const content = element.textContent?.trim() || '';
    const sentences = content
      .split(/(?<=[.!?])\s+/)
      .filter((sentence) => sentence.length > 0);

    const item: Part = {
      tagName: element.tagName.toLowerCase(),
      id,
      content,
      paragraphId: currentPartId,
      sectionId: currentSectionId,
      sentences,
    };
    result.push(item);
  });

  return result;
};

export default extractWebsiteParts;
