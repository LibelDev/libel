export const insertAfter = (newChild: Node, referenceChild: Node) => {
  return referenceChild.parentNode?.insertBefore(newChild, referenceChild.nextSibling);
};

export const appendScript = (src: string) => {
  const script = document.createElement('script');
  script.src = src;
  document.body.appendChild(script);
};
