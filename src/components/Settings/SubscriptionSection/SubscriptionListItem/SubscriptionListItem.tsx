import classNames from 'classnames';
import debugFactory from 'debug';
import type React from 'react';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type Subscription from '../../../../models/Subscription';
import SubscriptionItem from '../SubscriptionItem/SubscriptionItem';
import styles from './SubscriptionListItem.module.scss';

export interface IProps {
  subscription: Subscription;
  index: number;
  onSort: (dragIndex: number, hoverIndex: number) => void;
}

type TComponentProps = React.ComponentPropsWithoutRef<'li'>;

type TProps = IProps & TComponentProps;

interface IDragItem {
  subscription: Subscription;
  index: number;
}

interface IDragCollectedProps {
  dragging: boolean;
}

interface IDropCollectedProps {
  hovering: boolean;
}

export enum DraggableItemType {
  SubscriptionListItem = 'SubscriptionListItem'
}

const debug = debugFactory('libel:component:SubscriptionListItem');

/**
 * SubscriptionListItem component with sorting feature
 * @see https://github.com/react-dnd/react-dnd/blob/main/packages/examples/src/04-sortable/simple/Card.tsx
 */
const SubscriptionListItem: React.FunctionComponent<TProps> = (props) => {
  const { className, subscription, index, onSort, ...otherProps } = props;

  const ref = useRef<HTMLLIElement>(null);

  const [{ dragging }, drag] = useDrag<IDragItem, void, IDragCollectedProps>(() => ({
    type: DraggableItemType.SubscriptionListItem,
    item: () => ({ subscription, index }),
    collect: (monitor) => ({
      dragging: monitor.isDragging(),
    }),
  }), [subscription, index]);

  const [, drop] = useDrop<IDragItem, void, IDropCollectedProps>(() => ({
    accept: DraggableItemType.SubscriptionListItem,
    hover: (item, monitor) => {
      if (ref.current) {
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex !== hoverIndex) {
          const { top, bottom } = ref.current?.getBoundingClientRect(); // the hovering item
          const { y } = monitor.getClientOffset()!;
          debug('useDrop', top, bottom, y);
          // dragging downwards but the cursor has not passed the border yet
          if (dragIndex < hoverIndex && y < top) {
            return;
          }
          // dragging upwards but the cursor has not passed the border yet
          if (dragIndex > hoverIndex && y > bottom) {
            return;
          }
          /**
           * @description
           * We're mutating the monitor item here!
           * Generally it's better to avoid mutations,
           * but it's good here for the sake of performance
           * to avoid expensive index searches.
           */
          onSort(dragIndex, hoverIndex);
          item.index = hoverIndex;
        }
      }
    }
  }), [subscription, index, onSort]);

  drag(drop(ref));

  return (
    <li
      {...otherProps}
      ref={ref}
      className={
        classNames(
          className,
          [styles.subscriptionListItem],
          {
            [styles.dragging]: dragging
          }
        )
      }
    >
      <SubscriptionItem
        className={styles.subscription}
        subscription={subscription}
        index={index}
      />
    </li>
  );
};

SubscriptionListItem.displayName = 'SubscriptionListItem';

export default SubscriptionListItem;
