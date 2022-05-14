import classNames from 'classnames';
import debugFactory from 'debug';
import produce from 'immer';
import type React from 'react';
import { useCallback } from 'react';
import { DndProvider as DragAndDropProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as TEXTS from '../../../constants/texts';
import { selectSubscriptions } from '../../../store/selectors';
import { actions as subscriptionsActions } from '../../../store/slices/subscriptions';
import { useTypedDispatch, useTypedSelector } from '../../../store/store';
import lihkgCssClasses from '../../../stylesheets/variables/lihkg/classes.module.scss';
import AddSubscriptionButton from './AddSubscriptionButton/AddSubscriptionButton';
import SubscriptionListItem, { IProps as ISubscriptionListItemProps } from './SubscriptionListItem/SubscriptionListItem';
import styles from './SubscriptionSection.module.scss';

const debug = debugFactory('libel:component:SubscriptionSection');

const SubscriptionSection: React.FunctionComponent = () => {
  const dispatch = useTypedDispatch();
  const subscriptions = useTypedSelector(selectSubscriptions);

  const handleSort: ISubscriptionListItemProps['onSort'] = useCallback((dragIndex, hoverIndex) => {
    debug('handleSort', dragIndex, hoverIndex);
    const _subscriptions = produce(subscriptions, (subscriptions) => {
      const draggingSubscription = subscriptions[dragIndex];
      subscriptions.splice(dragIndex, 1);
      subscriptions.splice(hoverIndex, 0, draggingSubscription);
    });
    dispatch(subscriptionsActions.update(_subscriptions));
  }, [subscriptions]);

  return (
    <>
      <small className={classNames(lihkgCssClasses.settingSectionTitle, styles.sectionTitle)}>
        {TEXTS.SETTINGS_TITLE_SUBSCRIPTION}
        <AddSubscriptionButton />
      </small>
      {
        subscriptions.length > 0 ? (
          <DragAndDropProvider backend={HTML5Backend}>
            <ul className={lihkgCssClasses.settingOptionsList}>
              {
                subscriptions.map((subscription, index) => (
                  <SubscriptionListItem
                    key={subscription.url}
                    className={lihkgCssClasses.settingOptionsItem}
                    subscription={subscription}
                    index={index}
                    onSort={handleSort}
                  />
                ))
              }
            </ul>
          </DragAndDropProvider>
        ) : (
          <div className={lihkgCssClasses.settingOptionsList}>
            <div className={lihkgCssClasses.settingOptionsItem}>
              <span className={styles.empty}>
                {TEXTS.SUBSCRIPTION_LIST_MESSAGE_EMPTY}
              </span>
            </div>
          </div>
        )
      }
    </>
  );
};

SubscriptionSection.displayName = 'SubscriptionSection';

export default SubscriptionSection;
