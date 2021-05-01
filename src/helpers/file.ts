export const download = (json: string, filename: string) => {
  const blob = new Blob([json], { type: 'text/json' });
  const anchor = document.createElement('a');
  const url = URL.createObjectURL(blob);
  anchor.setAttribute('href', url);
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
