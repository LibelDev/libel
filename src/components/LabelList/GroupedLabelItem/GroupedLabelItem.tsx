import { autoUpdate, Strategy, useFloating } from '@floating-ui/react-dom';
import React, { useCallback, useEffect, useMemo } from 'react';
import useFadeoutScroll from '../../../hooks/useFadeoutScroll';
import { IGroupedLabelItem } from '../../../types/label';
import LabelItem from '../../LabelItem/LabelItem';
import LabelInfoList from '../LabelInfoList/LabelInfoList';
import styles from './GroupedLabelItem.module.scss';

interface IProps {
  text: string;
  items: IGroupedLabelItem[];
  floatingStrategy?: Strategy;
}

const GroupedLabelItem: React.FunctionComponent<IProps> = (props) => {
  const { text, items, floatingStrategy } = props;

  const [labelListInfoRef, fadeoutScrollStyle] = useFadeoutScroll<HTMLUListElement>(0.2);

  const { x, y, reference, floating, strategy, update, refs } = useFloating({
    strategy: floatingStrategy,
    placement: 'bottom-start'
  });

  const labelInfoListStyle: React.CSSProperties = useMemo(() => ({
    ...fadeoutScrollStyle,
    position: strategy,
    top: y ?? '',
    left: x ?? ''
  }), [strategy, x, y, fadeoutScrollStyle]);

  const updateLabelInfoListRef = useCallback((element: HTMLUListElement) => {
    labelListInfoRef.current = element;
    floating(element);
  }, [floating]);

  useEffect(() => {
    const { reference, floating } = refs;
    if (!reference.current || !floating.current) {
      return;
    }
    return autoUpdate(reference.current, floating.current, update);
  }, [refs.reference, refs.floating, update]);

  return (
    <React.Fragment>
      <LabelItem
        ref={reference}
        className={styles.labelItem}
        text={text}
        onMouseEnter={update}
      >
        {
          items.length > 1 && (
            <span className={styles.badge}>
              {items.length}
            </span>
          )
        }
      </LabelItem>
      <LabelInfoList
        ref={updateLabelInfoListRef}
        className={styles.labelInfoList}
        items={items}
        style={labelInfoListStyle}
      />
    </React.Fragment>
  );
};

export default GroupedLabelItem;
