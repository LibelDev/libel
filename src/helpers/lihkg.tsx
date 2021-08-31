import { Store } from '@reduxjs/toolkit';
import React from 'react';
import ReactDOM, { Renderer } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import cache from '../cache';
import AddLabelButton from '../components/AddLabelButton/AddLabelButton';
import announcementStyles from '../components/Announcement/Announcement.scss';
import LabelBook from '../components/LabelBook/LabelBook';
import LabelList from '../components/LabelList/LabelList';
import labelListStyles from '../components/LabelList/LabelList.scss';
import SettingSection from '../components/SettingSection/SettingSection';
import * as ATTRIBUTES from '../constants/attributes';
import * as REGEXES from '../constants/regexes';
import * as TEXTS from '../constants/texts';
import { persistor } from '../store/store';
import lihkgCssClasses from '../stylesheets/variables/lihkg/classes.scss';
import lihkgSelectors from '../stylesheets/variables/lihkg/selectors.scss';
import { IUser } from '../types/user';
import { insertAfter, waitForElement } from './dom';

type TRendererContainer = Parameters<Renderer>[1];

export const getUserRegistrationDate = (user: IUser) => {
  return new Date(user.create_time * 1000);
};

export const isThread = (node: Node) => {
  return (node as Element).matches(`.${lihkgCssClasses.thread}`);
};

export const isUserCardModal = (node: Node) => {
  return isModalTitleMatched(node, TEXTS.USER_CARD_MODAL_TITLE);
};

export const isSettingsModal = (node: Node) => {
  return isModalTitleMatched(node, TEXTS.SETTINGS_MODAL_TITLE);
};

export const isNickname = (node: Node) => {
  return (node as Element).matches(`.${lihkgCssClasses.nickname}`);
};

export const querySelectorNickname = (node: Node) => {
  return (node as Element).querySelectorAll(`.${lihkgCssClasses.nickname}`);
};

const querySelectorNicknameLink = (node: Node) => {
  const nicknameLinkSelector = `.${lihkgCssClasses.nickname} > a[href^="/profile"]`;
  return (node as Element).querySelector(nicknameLinkSelector);
};

const isModalTitleMatched = (node: Node, title: string) => {
  if ((node as Element).matches(`.${lihkgCssClasses.modal}`)) {
    const modalTitle = (node as Element).querySelector(`.${lihkgCssClasses.modalTitle}`);
    if (modalTitle) {
      return modalTitle.textContent === title;
    }
  }
  return false;
};

const renderAddLabelButton = (user: string, store: Store, container: TRendererContainer) => {
  const postID = cache.targetReply?.getAttribute(ATTRIBUTES.dataPostId)!;
  const targetReply = cache.getReply(postID);
  if (targetReply) {
    ReactDOM.render(
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AddLabelButton user={user} targetReply={targetReply}>
            {TEXTS.ADD_LABEL_BUTTON_TEXT}
          </AddLabelButton>
        </PersistGate>
      </Provider>,
      container
    );
  }
};

const renderLabelList = (user: string, store: Store, hasInfo: boolean, hasSnipeButton: boolean, container: TRendererContainer) => {
  (container as Element).classList.add(labelListStyles.container);
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <LabelList user={user} hasInfo={hasInfo} hasSnipeButton={hasSnipeButton} />
      </PersistGate>
    </Provider>,
    container
  );
};

const renderLabelBook = (user: string, store: Store, container: TRendererContainer) => {
  (container as Element).classList.add(lihkgCssClasses.threadHeadingText);
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <LabelBook user={user} />
      </PersistGate>
    </Provider>,
    container
  );
};

const renderSettingSection = (store: Store, container: TRendererContainer) => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SettingSection />
      </PersistGate>
    </Provider>,
    container
  );
};

export const renderAnnouncement = async (announcement: React.ReactElement) => {
  const container = document.createElement('div');
  container.classList.add(announcementStyles.container);
  const rightPanelContainer = await waitForRightPanelContainer();
  rightPanelContainer?.insertBefore(container, rightPanelContainer.firstChild);
  ReactDOM.render(announcement!, container);
};

export const handleThread = (node: Node, store: Store) => {
  const _node = node as Element;
  const threadLink = _node.querySelector(`.${lihkgCssClasses.threadLink}`)!;
  const href = threadLink.getAttribute('href')!;
  const threadId = href.match(REGEXES.THREAD_URL)![1];
  const thread = cache.getThread(threadId);
  if (thread) {
    const { user_id: user } = thread;
    const threadUsername = _node.querySelector(`.${lihkgCssClasses.threadUsername}`)!;
    const labelBookContainer = document.createElement('div');
    insertAfter(labelBookContainer, threadUsername);
    renderLabelBook(user, store, labelBookContainer);
  }
};

export const handleUserCardModal = (node: Node, store: Store) => {
  const _node = node as Element;
  const doxButtonSelector = `.${lihkgCssClasses.userCardButtonsContainer} > a[href^="/profile"]`;
  const doxButton = _node.querySelector(doxButtonSelector);
  const href = doxButton?.getAttribute('href');
  const matched = href?.match(REGEXES.PROFILE_URL);
  if (matched) {
    const [, user] = matched;
    const modelContentInner = _node.querySelector(`.${lihkgCssClasses.modalContent} > div`)!;
    const labelListContainer = document.createElement('div');
    modelContentInner.appendChild(labelListContainer);
    renderLabelList(user, store, true, false, labelListContainer);
    const userCardButtonsContainer = _node.querySelector(`.${lihkgCssClasses.userCardButtonsContainer}`)!;
    const addLabelButtonContainer = document.createElement('div');
    userCardButtonsContainer.appendChild(addLabelButtonContainer);
    renderAddLabelButton(user, store, addLabelButtonContainer);
  }
};

export const handleSettingsModal = (node: Node, store: Store) => {
  const _node = node as Element;
  const modelContentInner = _node.querySelector(`.${lihkgCssClasses.modalContent} > div`)!;
  const settingSectionContainer = document.createElement('div');
  modelContentInner.appendChild(settingSectionContainer);
  renderSettingSection(store, settingSectionContainer);
};

export const handleNicknames = (nodes: NodeList, store: Store) => {
  const _nodes = Array.from(nodes);
  for (const node of _nodes) {
    handleNickname(node, store);
  }
};

const handleNickname = (node: Node, store: Store) => {
  const nicknameLink = querySelectorNicknameLink(node);
  if (nicknameLink) {
    const href = nicknameLink.getAttribute('href')!;
    const matched = href.match(REGEXES.PROFILE_URL);
    if (matched) {
      const [, user] = matched;
      (node as any).container?.remove();
      const container = document.createElement('div');
      insertAfter(container, node);
      renderLabelList(user, store, true, true, container);
      (node as any).container = container;
    }
  }
};

export const waitForSubmissionForm = () => {
  return waitForElement(`.${lihkgCssClasses.submissionForm}`);
};

const waitForRightPanelContainer = async () => {
  const splitView = await waitForElement(lihkgSelectors.splitView);
  return splitView.querySelector(`.${lihkgCssClasses.rightPanelContainer}`)!;
};
