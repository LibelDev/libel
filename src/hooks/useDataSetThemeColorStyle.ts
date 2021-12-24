import { useMemo } from 'react';
import Personal from '../models/Personal';
import Subscription from '../models/Subscription';

const useDataSetThemeColorStyle = (dataSet: Personal | Subscription, mapper: (color: string) => Partial<React.CSSProperties> | undefined) => {
  const style = useMemo(() => {
    const color = Subscription.implements(dataSet) ? dataSet.color : undefined;
    if (color) {
      return mapper(color);
    }
    return undefined;
  }, [dataSet, mapper]);
  return style;
};

export default useDataSetThemeColorStyle;
