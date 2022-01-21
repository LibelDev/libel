import React from 'react';
import { THREAD_USER_LABELS_TOOLTIP } from '../../constants/texts';
import { MappedHTMLAttributes } from '../../helpers/types';
import Label from '../../models/Label';
import { createUserPersonalLabelsSelector, createUserSubscriptionLabelsSelector } from '../../store/selectors';
import { useTypedSelector } from '../../store/store';
import styles from './LabelBook.scss';

interface IProps {
  user: string;
}

type TProps = IProps & MappedHTMLAttributes<'div'>;

const LabelBook: React.FunctionComponent<TProps> = (props) => {
  const { user } = props;
  // const personal = useTypedSelector(createUserPersonalSelector(user));
  // const subscriptions = useTypedSelector(createUserSubscriptionsSelector(user));
  const personalLabels = useTypedSelector(createUserPersonalLabelsSelector(user));
  const subscriptionLabels = useTypedSelector(createUserSubscriptionLabelsSelector(user));
  const labels = ([] as Label[]).concat(personalLabels, subscriptionLabels);
  return labels.length ? (
    <div
      className={styles.labelBook}
      data-tip={THREAD_USER_LABELS_TOOLTIP}
      aria-hidden={true}
    >
      <span>{labels.length}</span>
    </div>
  ) : null;
};

export default LabelBook;
