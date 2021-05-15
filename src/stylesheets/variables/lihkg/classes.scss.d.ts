export type Styles = {
  'modal': string;
  'modalContent': string;
  'modalTitle': string;
  'navStickyHidden': string;
  'nickname': string;
  'replyItem': string;
  'replyToolbarButton': string;
  'rightPanelContainer': string;
  'settingOptionButton': string;
  'settingOptionsItem': string;
  'settingOptionsList': string;
  'settingSectionTitle': string;
  'submissionForm': string;
  'thread': string;
  'threadHeadingText': string;
  'threadLink': string;
  'threadUsername': string;
  'userCardButtonsContainer': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
