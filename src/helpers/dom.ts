export const insertAfter = (newChild: Node, referenceChild: Node) => {
  return referenceChild.parentNode?.insertBefore(newChild, referenceChild.nextSibling);
};
