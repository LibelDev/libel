import { Store } from '@reduxjs/toolkit';
import moment from 'moment';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM, { Renderer } from 'react-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { insertAfter } from './dom';
import cache from '../cache';
import AddLabelButton from '../components/AddLabelButton/AddLabelButton';
import LabelBook from '../components/LabelBook/LabelBook';
// import labelBookStyles from '../components/LabelBook/LabelBook.scss';
import LabelList from '../components/LabelList/LabelList';
import labelListStyles from '../components/LabelList/LabelList.scss';
import SettingSection from '../components/SettingSection/SettingSection';
import * as TEXTS from '../constants/texts';
import * as REGEXES from '../constants/regexes';
import { persistor } from '../store/store';
import lihkgCssClasses from '../stylesheets/variables/lihkg/classes.scss';
import { IUser } from '../types/user';

export const getUserRegistrationDate = (user: IUser) => {
  return moment(user.create_time * 1000);
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

export const isSubmissionForm = (node: Node) => {
  return (node as Element).matches(`.${lihkgCssClasses.submissionForm}`);
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

const renderAddLabelButton = <C extends Parameters<Renderer>[1]> (user: string, store: Store, componentWrapper: C) => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AddLabelButton user={user} source={cache.currentReply}>
          {TEXTS.ADD_LABEL_BUTTON_TEXT}
        </AddLabelButton>
      </PersistGate>
    </Provider>,
    componentWrapper
  );
};

const renderLabelList = <C extends Parameters<Renderer>[1]> (user: string, store: Store, hasInfo: boolean, hasSnipeButton: boolean, componentWrapper: C) => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <LabelList user={user} hasInfo={hasInfo} hasSnipeButton={hasSnipeButton} />
      </PersistGate>
    </Provider>,
    componentWrapper
  );
};

const renderLabelBook = <C extends Parameters<Renderer>[1]> (user: string, store: Store, componentWrapper: C) => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <LabelBook user={user} />
      </PersistGate>
    </Provider>,
    componentWrapper
  );
};

const renderSettingSection = <C extends Parameters<Renderer>[1]> (store: Store, componentWrapper: C) => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SettingSection />
      </PersistGate>
    </Provider>,
    componentWrapper
  );
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
    labelBookContainer.classList.add(lihkgCssClasses.threadHeadingText);
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
    labelListContainer.classList.add(labelListStyles.componentWrapper);
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
      (node as any).componentWrapper?.remove();
      const componentWrapper = document.createElement('div');
      componentWrapper.classList.add(labelListStyles.componentWrapper);
      insertAfter(componentWrapper, node);
      renderLabelList(user, store, true, true, componentWrapper);
      (node as any).componentWrapper = componentWrapper;
    }
  }
};

export const waitForSubmissionForm = (): Promise<Node> => {
  const element = document.querySelector(`.${lihkgCssClasses.submissionForm}`);
  if (element) {
    return Promise.resolve(element as Node);
  }
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        switch (mutation.type) {
          case 'childList': {
            const nodes = Array.from(mutation.addedNodes);
            for (const node of nodes) {
              if (node.nodeType === document.ELEMENT_NODE) {
                if (isSubmissionForm(node)) {
                  observer.disconnect();
                  return resolve(node);
                }
              }
            }
            break;
          }
        }
      }
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true
    });
  });
};
