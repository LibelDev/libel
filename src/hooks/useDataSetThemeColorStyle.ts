import { useMemo } from 'react';
import Personal from '../models/Personal';
import Subscription from '../models/Subscription';

const useDataSetThemeColorStyle = (dataSet: Personal | Subscription, property: string) => {
  const style = useMemo(() => ({
    [property]: Subscription.implements(dataSet) ? dataSet.color : undefined
  }), [dataSet, property]);
  return style;
};

export default useDataSetThemeColorStyle;
