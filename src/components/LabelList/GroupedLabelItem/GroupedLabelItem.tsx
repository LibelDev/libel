import { autoUpdate, flip, useFloating } from '@floating-ui/react-dom';
import React, { useCallback, useEffect, useMemo } from 'react';
import useFadeoutScroll from '../../../hooks/useFadeoutScroll';
import type { IGroupedLabelItem } from '../../../types/label';
import LabelItem from '../../LabelItem/LabelItem';
import LabelInfoList from '../LabelInfoList/LabelInfoList';
import Badge from './Badge';
import styles from './GroupedLabelItem.module.scss';

export interface IProps {
  text: string;
  items: IGroupedLabelItem[];
  floatingConfig?: Parameters<typeof useFloating>[0];
}

const GroupedLabelItem: React.FunctionComponent<IProps> = (props) => {
  const { text, items, floatingConfig } = props;

  /**
   * omit the unnecessary hooks if there is no label info list  
   * CAVEAT: conditional hooks may cause React warnings
   * if conditions are changed between renderings
   */
  if (!floatingConfig) {
    return (
      <LabelItem className={styles.labelItem}>
        {text}
        <Badge className={styles.badge} quantity={items.length} />
      </LabelItem>
    );
  }

  const [labelListInfoRef, fadeoutScrollStyle] = useFadeoutScroll<HTMLUListElement>(0.3);
  const _floatingConfig = useMemo(() => ({
    middleware: [flip()],
    ...floatingConfig,
  }), [floatingConfig]);
  const { x, y, reference, floating, strategy, update, refs } = useFloating(_floatingConfig);

  const labelInfoListStyle: React.CSSProperties = useMemo(() => ({
    ...fadeoutScrollStyle,
    position: strategy,
    top: y ?? '',
    left: x ?? ''
  }), [strategy, x, y, fadeoutScrollStyle]);

  const updateLabelInfoListRef: React.RefCallback<HTMLUListElement> = useCallback((element: HTMLUListElement) => {
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
      <LabelItem ref={reference} className={styles.labelItem}>
        {text}
        <Badge className={styles.badge} quantity={items.length} />
      </LabelItem>
      <LabelInfoList
        ref={updateLabelInfoListRef}
        className={styles.labelInfoList}
        style={labelInfoListStyle}
        items={items}
      />
    </React.Fragment>
  );
};

export default GroupedLabelItem;
