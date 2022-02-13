import classnames from 'classnames';
import React, { useCallback } from 'react';
import * as TEXTS from '../../../../constants/texts';
import useDataSetThemeColorStyle from '../../../../hooks/useDataSetThemeColorStyle';
import Subscription from '../../../../models/Subscription';
import { IconName } from '../../../../types/icon';
import Icon from '../../../Icon/Icon';
import LoadingSpinner from '../../../LoadingSpinner/LoadingSpinner';
import ReloadSubscriptionButton from '../ReloadSubscriptionButton/ReloadSubscriptionButton';
import RemoveSubscriptionButton from '../RemoveSubscriptionButton/RemoveSubscriptionButton';
import SubscriptionHomepageButton from '../SubscriptionHomepageButton/SubscriptionHomepageButton';
import ToggleSubscriptionButton from '../ToggleSubscriptionButton/ToggleSubscriptionButton';
import styles from './SubscriptionItem.scss';

interface IProps {
  subscription: Subscription;
  index: number;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'div'>;

const SubscriptionItem: React.FunctionComponent<TProps> = (props) => {
  const { className, subscription, index } = props;

  const dataSetThemeColorStyle = useDataSetThemeColorStyle(subscription, useCallback((color) => ({
    backgroundColor: color
  }), []));

  return (
    <div className={classnames(className, styles.subscription)}>
      <i
        className={styles.bar}
        style={dataSetThemeColorStyle}
        aria-hidden={true}
      />
      {
        subscription.error ? (
          <Icon
            icon={IconName.CommentAlert}
            aria-label={subscription.error}
            data-tip={subscription.error}
            title={subscription.error}
          />
        ) : (
          subscription.loading ? (
            <LoadingSpinner />
          ) : (
            subscription.version && (
              <Icon
                icon={IconName.Verified}
                aria-label={TEXTS.SUBSCRIPTION_LOAD_SUCCESS}
                data-tip={TEXTS.SUBSCRIPTION_LOAD_SUCCESS}
                title={TEXTS.SUBSCRIPTION_LOAD_SUCCESS}
              />
            )
          )
        )
      }
      <span className={styles.name}>
        <a href={subscription.url} target="_blank">
          {subscription.name || subscription.url}
        </a>
      </span>
      <SubscriptionHomepageButton
        className={styles.iconButton}
        subscription={subscription}
      />
      <RemoveSubscriptionButton
        className={styles.iconButton}
        subscription={subscription}
        index={index}
      />
      <ReloadSubscriptionButton
        className={styles.iconButton}
        subscription={subscription}
        index={index}
      />
      <ToggleSubscriptionButton
        subscription={subscription}
        index={index}
      />
    </div>
  );
};

export default SubscriptionItem;
