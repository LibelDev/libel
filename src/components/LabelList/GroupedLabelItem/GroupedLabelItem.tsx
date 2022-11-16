import { autoUpdate, flip, useFloating } from '@floating-ui/react-dom';
import type React from 'react';
import { memo, useEffect, useMemo } from 'react';
import type { TLabelsGroupItem } from '../../../helpers/labelList';
import useFadeoutScroll from '../../../hooks/useFadeoutScroll';
import EmoticonTranslator from '../../EmoticonTranslator/EmoticonTranslator';
import LabelItem from '../../LabelItem/LabelItem';
import LabelInfoList from '../LabelInfoList/LabelInfoList';
import Badge from './Badge';
import styles from './GroupedLabelItem.module.scss';

export interface IProps {
  text: string;
  items: TLabelsGroupItem[];
  /** control the floating config of the `LabelInfoList` component */
  floatingConfig?: Parameters<typeof useFloating>[0];
}

type TProps = IProps;

const GroupedLabelItem: React.FunctionComponent<TProps> = memo((props) => {
  const { text, items, floatingConfig } = props;

  /**
   * omit the unnecessary hooks if there is no label info list
   * CAVEAT: conditional hooks may cause React warnings
   * if conditions are changed between renderings
   */
  if (!floatingConfig) {
    return (
      <LabelItem className={styles.labelItem}>
        <EmoticonTranslator className={styles.emoticon}>
          {text}
        </EmoticonTranslator>
        <Badge className={styles.badge} quantity={items.length} />
      </LabelItem>
    );
  }

  const { x, y, reference, floating, strategy, update, refs } = useFloating({
    middleware: [flip()],
    placement: 'bottom-start',
    ...floatingConfig
  });

  const [labelInfoListRef, fadeoutScrollStyle] = useFadeoutScroll<HTMLUListElement>({ yFadingRate: 0.3 });

  const labelInfoListStyle: React.CSSProperties = useMemo(() => ({
    ...fadeoutScrollStyle,
    position: strategy,
    top: y ?? '',
    left: x ?? ''
  }), [x, y, strategy, fadeoutScrollStyle]);

  useEffect(() => {
    floating(labelInfoListRef.current);
  }, [floating]);

  useEffect(() => {
    const { reference, floating } = refs;
    if (!reference.current || !floating.current) {
      return;
    }
    return autoUpdate(reference.current, floating.current, update);
  }, [refs.reference, refs.floating, update]);

  return (
    <>
      <LabelItem ref={reference} className={styles.labelItem} onMouseEnter={update}>
        <EmoticonTranslator className={styles.emoticon}>
          {text}
        </EmoticonTranslator>
        <Badge className={styles.badge} quantity={items.length} />
      </LabelItem>
      <LabelInfoList
        ref={labelInfoListRef}
        className={styles.labelInfoList}
        style={labelInfoListStyle}
        items={items}
      />
    </>
  );
});

GroupedLabelItem.displayName = 'GroupedLabelItem';

export default GroupedLabelItem;
