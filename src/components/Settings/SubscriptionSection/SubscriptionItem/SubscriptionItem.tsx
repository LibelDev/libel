import classNames from 'classnames';
import type React from 'react';
import { useMemo } from 'react';
import * as TEXTS from '../../../../constants/texts';
import type { ISubscription } from '../../../../models/Subscription';
import Icon from '../../../Icon/Icon';
import { IconName } from '../../../Icon/types';
import LoadingSpinner from '../../../LoadingSpinner/LoadingSpinner';
import ReloadSubscriptionButton from '../ReloadSubscriptionButton/ReloadSubscriptionButton';
import RemoveSubscriptionButton from '../RemoveSubscriptionButton/RemoveSubscriptionButton';
import SubscriptionHomepageButton from '../SubscriptionHomepageButton/SubscriptionHomepageButton';
import ToggleSubscriptionButton from '../ToggleSubscriptionButton/ToggleSubscriptionButton';
import styles from './SubscriptionItem.module.scss';

interface IProps {
  subscription: ISubscription;
  index: number;
}

type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

type TProps = IProps & TComponentProps;

const SubscriptionItem: React.FunctionComponent<TProps> = (props) => {
  const { className, subscription, index } = props;

  const style = useMemo(() => {
    const { color } = subscription;
    return { backgroundColor: color };
  }, [subscription]);

  return (
    <div className={classNames(className, styles.subscription)}>
      <i
        className={styles.bar}
        style={style}
        aria-hidden
      />
      <span className={styles.name}>
        <a href={subscription.url} target="_blank">
          {subscription.name || subscription.url}
        </a>
        {
          subscription.error ? (
            <Icon
              className={classNames(styles.status, styles.error)}
              icon={IconName.CommentAlert}
              aria-hidden={false}
              aria-label={subscription.error}
              data-tip={subscription.error}
              title={subscription.error}
            />
          ) : (
            subscription.loading ? (
              <LoadingSpinner className={classNames(styles.status, styles.loading)} />
            ) : (
              subscription.loaded && (
                <Icon
                  className={styles.status}
                  icon={IconName.Verified}
                  aria-hidden={false}
                  aria-label={TEXTS.SUBSCRIPTION_MESSAGE_LOAD_SUCCESS}
                  data-tip={TEXTS.SUBSCRIPTION_MESSAGE_LOAD_SUCCESS}
                  title={TEXTS.SUBSCRIPTION_MESSAGE_LOAD_SUCCESS}
                />
              )
            )
          )
        }
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

SubscriptionItem.displayName = 'SubscriptionItem';

export default SubscriptionItem;
