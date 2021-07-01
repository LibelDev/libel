import * as TEXTS from '../constants/texts';

const prompt = (defaultText = '', defaultReason = '') => {
  const text = (window.prompt(TEXTS.ADD_LABEL_QUESTION, defaultText) || '').trim();
  if (text) {
    const reason = window.prompt(TEXTS.ADD_LABEL_REASON_QUESTION, defaultReason);
    if (reason !== null) {
      return {
        text,
        reason: reason.trim()
      };
    }
  }
};

export const promptAdd = () => {
  const data = prompt();
  if (data) {
    const isScreenshotEnabled = window.confirm(TEXTS.ADD_LABEL_ENABLE_SCREENSHOT_QUESTION);
    return {
      ...data,
      isScreenshotEnabled
    };
  }
};

export const promptEdit = (text: string, reason?: string, image = '') => {
  const data = prompt(text, reason);
  if (data) {
    const _image = window.prompt(TEXTS.ADD_LABEL_SCREENSHOT_QUESTION, image);
    if (_image !== null) {
      return {
        ...data,
        image: _image?.trim()
      };
    }
  }
};
