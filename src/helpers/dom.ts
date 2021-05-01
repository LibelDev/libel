export const createStylesheet = (stylesheet: string) => {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = stylesheet;
  return style;
};

export const insertAfter = (newChild: Node, referenceChild: Node) => {
  return referenceChild.parentNode?.insertBefore(newChild, referenceChild.nextSibling);
};
