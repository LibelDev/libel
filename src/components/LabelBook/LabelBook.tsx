import flatMap from 'lodash/flatMap';
import React from 'react';
import { THREAD_USER_LABELS_TOOLTIP } from '../../constants/texts';
import { MappedHTMLAttributes } from '../../helpers/types';
import { ILabel } from '../../models/Label';
import { filterPersonalForUser, filterSubscriptionsForUser } from '../../store/selectors';
import { useTypedSelector } from '../../store/store';
import styles from './LabelBook.scss';

interface IProps {
  user: string;
}

type TProps = IProps & MappedHTMLAttributes<'div'>;

const LabelBook: React.FunctionComponent<TProps> = (props) => {
  const { user } = props;
  const personal = useTypedSelector(filterPersonalForUser(user));
  const { labels: personalLabels } = personal.aggregate();
  const subscriptions = useTypedSelector(filterSubscriptionsForUser(user));
  const subscriptionLabels = flatMap(
    subscriptions.map((subscription) => subscription.aggregate()),
    ({ labels }) => labels
  );
  const labels = ([] as ILabel[]).concat(personalLabels, subscriptionLabels);
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
