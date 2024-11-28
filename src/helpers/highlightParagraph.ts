const highlightParagraph = (
  id: string,
  attr: string = 'data-vectordb-id'
): void => {
  const attributeName = `${attr}-highlighted`;
  const highlighted = document.querySelectorAll(`[${attributeName}]`);
  highlighted.forEach((element) => {
    (element as HTMLElement).style.backgroundColor = '';
    element.removeAttribute(attributeName);
  });
  const element: HTMLElement = document.querySelector(`[${attr}="${id}"]`);
  if (element) {
    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY - window.innerHeight / 2;
    window.scrollTo({
      top,
      behavior: 'smooth',
    });
    element.style.backgroundColor = 'yellow';
    element.setAttribute(attributeName, 'true');
  }
};

export default highlightParagraph;
