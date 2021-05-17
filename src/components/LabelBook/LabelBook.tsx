import flatMap from 'lodash/flatMap';
import React from 'react';
import { useSelector } from 'react-redux';
import { THREAD_USER_LABELS_TOOLTIP } from '../../constants/texts';
import { aggregate } from '../../helpers/label';
import { ILabel } from '../../models/Label';
import { filterPersonalForUser, filterSubscriptionsForUser } from '../../store/selectors';
import styles from './LabelBook.scss';

interface IProps extends React.HTMLAttributes<HTMLElement> {
  user: string;
}

const LabelBook: React.FunctionComponent<IProps> = (props) => {
  const { user } = props;
  const personal = useSelector(filterPersonalForUser(user));
  const { labels: personalLabels } = aggregate(personal);
  const subscriptions = useSelector(filterSubscriptionsForUser(user));
  const subscriptionLabels = flatMap(subscriptions.map(aggregate), ({ labels }) => labels);
  const labels = ([] as ILabel[]).concat(personalLabels, subscriptionLabels);
  return labels.length ? (
    <div
      className={styles.labelBook}
      aria-hidden={true}
      data-tip={THREAD_USER_LABELS_TOOLTIP}
    >
      <span>{labels.length}</span>
    </div>
  ) : null;
};

export default LabelBook;
