import type { IDataSet } from '../models/DataSet';
import type { ISerializedSubscription } from '../models/Subscription';
import { mergeDataSet, mergeSubscriptions } from './merge';

describe('mergeDataSet', () => {
  it('should have 1 user, 1 label', () => {
    const dataSetA: IDataSet = {
      data: {
        '1': [
          { id: '1', text: 'Label 1A' }
        ]
      }
    };
    const dataSetB: IDataSet = {
      data: {
        '1': [
          { id: '1', text: 'Label 2B' }
        ]
      }
    };
    const merged = mergeDataSet(dataSetA, dataSetB, false);
    expect(Object.keys(merged.data).length).toBe(1);
    expect(merged.data['1']!.length).toBe(1);
    expect(merged.data['1']![0]).toEqual(dataSetB.data['1']![0]);
  });

  it('should have 1 user, 2 labels', () => {
    const dataSetA: IDataSet = {
      data: {
        '1': [
          { id: '1', text: 'Label 1A' }
        ]
      }
    };
    const dataSetB: IDataSet = {
      data: {
        '1': [
          { id: '2', text: 'Label 2B' }
        ]
      }
    };
    const merged = mergeDataSet(dataSetA, dataSetB, false);
    expect(Object.keys(merged.data).length).toBe(1);
    expect(merged.data['1']!.length).toBe(2);
    expect(merged.data['1']![0]).toBe(dataSetA.data['1']![0]);
    expect(merged.data['1']![1]).toBe(dataSetB.data['1']![0]);
  });

  it('should have 2 users, 2 labels', () => {
    const dataSetA: IDataSet = {
      data: {
        '1': [
          { id: '1', text: 'Label 1A' }
        ]
      }
    };
    const dataSetB: IDataSet = {
      data: {
        '2': [
          { id: '1', text: 'Label 1B' }
        ]
      }
    };
    const merged = mergeDataSet(dataSetA, dataSetB, false);
    expect(Object.keys(merged.data).length).toBe(2);
    expect(merged.data['1']!.length).toBe(1);
    expect(merged.data['1']![0]).toBe(dataSetA.data['1']![0]);
    expect(merged.data['2']!.length).toBe(1);
    expect(merged.data['2']![0]).toBe(dataSetB.data['2']![0]);
  });

  it('should have 1 user, 1 label', () => {
    const dataSetA: IDataSet = {
      data: {
        '1': [
          { id: '1', text: 'Label 1A' }
        ]
      }
    };
    const dataSetB: IDataSet = {
      data: {
        '1': [
          { id: '2', text: 'Label 2B' }
        ]
      }
    };
    const merged = mergeDataSet(dataSetA, dataSetB, true);
    expect(Object.keys(merged.data).length).toBe(1);
    expect(merged.data['1']!.length).toBe(1);
    expect(merged.data['1']![0]).toBe(dataSetB.data['1']![0]);
  });

  it('should have 1 user, 2 labels', () => {
    const dataSetA: IDataSet = {
      data: {
        '1': [
          { id: '1', text: 'Label 1A' }
        ]
      }
    };
    const dataSetB: IDataSet = {
      data: {
        '1': [
          { id: '1', text: 'Label 1B' },
          { id: '2', text: 'Label 2B' }
        ]
      }
    };
    const merged = mergeDataSet(dataSetA, dataSetB, true);
    expect(Object.keys(merged.data).length).toBe(1);
    expect(merged.data['1']!.length).toBe(2);
    expect(merged.data['1']![0]).toEqual(dataSetB.data['1']![0]);
    expect(merged.data['1']![1]).toBe(dataSetB.data['1']![1]);
  });

  it('should have 1 user, 2 labels', () => {
    const dataSetA: IDataSet = {
      data: {
        '1': [
          { id: '1', text: 'Label 1A' }
        ]
      }
    };
    const dataSetB: IDataSet = {
      data: {
        '2': [
          { id: '1', text: 'Label 1B' },
          { id: '2', text: 'Label 2B' }
        ]
      }
    };
    const merged = mergeDataSet(dataSetA, dataSetB, true);
    expect(Object.keys(merged.data).length).toBe(1);
    expect(merged.data['2']!.length).toBe(2);
    expect(merged.data['2']![0]).toBe(dataSetB.data['2']![0]);
    expect(merged.data['2']![1]).toBe(dataSetB.data['2']![1]);
  });

  it('should have 1 user, 3 labels', () => {
    const dataSetA: IDataSet = {
      data: {
        '1': [
          { text: 'Label 1A', reason: 'Reason A' },
          { text: 'Label 1A', reason: 'Reason B' },
          { text: 'Label 1B' }
        ]
      }
    };
    const dataSetB: IDataSet = {
      data: {
        '1': [
          { id: '1', text: 'Label 1A', reason: 'Reason A' },
          { id: '2', text: 'Label 1A', reason: 'Reason B' },
          { id: '3', text: 'Label 1B' }
        ]
      }
    };
    const merged = mergeDataSet(dataSetA, dataSetB, true);
    expect(Object.keys(merged.data).length).toBe(1);
    const mergedLabels = merged.data['1']!;
    expect(mergedLabels.length).toBe(3);
    for (let i = 0; i < mergedLabels.length; i++) {
      const mergedLabel = mergedLabels[i];
      expect(mergedLabel.id).toEqual(dataSetA.data['1']![i].id);
      expect(mergedLabel.text).toEqual(dataSetB.data['1']![i].text);
      expect(mergedLabel.reason).toEqual(dataSetB.data['1']![i].reason);
    }
  });
});

describe('mergeSubscriptions', () => {
  it('should have 1 subscription', () => {
    const subscriptionsA: ISerializedSubscription[] = [
      { name: 'A', url: 'URL_1', enabled: true }
    ];
    const subscriptionsB: ISerializedSubscription[] = [
      { name: 'B', url: 'URL_1', enabled: false }
    ];
    const merged = mergeSubscriptions(subscriptionsA, subscriptionsB, false);
    expect(merged.length).toBe(1);
    expect(merged[0]).toEqual(subscriptionsB[0]);
  });

  it('should have 2 subscriptions', () => {
    const subscriptionsA: ISerializedSubscription[] = [
      { name: 'A', url: 'URL_1', enabled: true }
    ];
    const subscriptionsB: ISerializedSubscription[] = [
      { name: 'B', url: 'URL_2', enabled: false }
    ];
    const merged = mergeSubscriptions(subscriptionsA, subscriptionsB, false);
    expect(merged.length).toBe(2);
    expect(merged[0]).toBe(subscriptionsA[0]);
    expect(merged[1]).toBe(subscriptionsB[0]);
  });

  it('should have 2 subscriptions', () => {
    const subscriptionsA: ISerializedSubscription[] = [
      { name: 'A', url: 'URL_1', enabled: true }
    ];
    const subscriptionsB: ISerializedSubscription[] = [
      { name: 'B', url: 'URL_1', enabled: false },
      { name: 'C', url: 'URL_2', enabled: true }
    ];
    const merged = mergeSubscriptions(subscriptionsA, subscriptionsB, false);
    expect(merged.length).toBe(2);
    expect(merged[0]).toEqual(subscriptionsB[0]);
    expect(merged[1]).toBe(subscriptionsB[1]);
  });

  it('should have 3 subscriptions', () => {
    const subscriptionsA: ISerializedSubscription[] = [
      { name: 'A', url: 'URL_1', enabled: true }
    ];
    const subscriptionsB: ISerializedSubscription[] = [
      { name: 'B', url: 'URL_2', enabled: false },
      { name: 'C', url: 'URL_3', enabled: true }
    ];
    const merged = mergeSubscriptions(subscriptionsA, subscriptionsB, false);
    expect(merged.length).toBe(3);
    expect(merged[0]).toBe(subscriptionsA[0]);
    expect(merged[1]).toBe(subscriptionsB[0]);
    expect(merged[2]).toBe(subscriptionsB[1]);
  });

  it('should have 1 subscription', () => {
    const subscriptionsA: ISerializedSubscription[] = [
      { name: 'A', url: 'URL_1', enabled: true }
    ];
    const subscriptionsB: ISerializedSubscription[] = [
      { name: 'B', url: 'URL_2', enabled: false }
    ];
    const merged = mergeSubscriptions(subscriptionsA, subscriptionsB, true);
    expect(merged.length).toBe(1);
    expect(merged[0]).toBe(subscriptionsB[0]);
  });

  it('should have 2 subscriptions', () => {
    const subscriptionsA: ISerializedSubscription[] = [
      { name: 'A', url: 'URL_1', enabled: true }
    ];
    const subscriptionsB: ISerializedSubscription[] = [
      { name: 'B', url: 'URL_2', enabled: false },
      { name: 'C', url: 'URL_3', enabled: true }
    ];
    const merged = mergeSubscriptions(subscriptionsA, subscriptionsB, true);
    expect(merged.length).toBe(2);
    expect(merged[0]).toBe(subscriptionsB[0]);
    expect(merged[1]).toBe(subscriptionsB[1]);
  });
});
