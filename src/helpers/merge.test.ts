import type { ISerializedConfig } from '../models/Config';
import type { ISerializedDataSet } from '../models/DataSet';
import type { ISerializedSubscription } from '../models/Subscription';
import { mergeConfig, mergeDataSet, mergeSubscriptions } from './merge';

describe('mergeConfig', () => {
  it('should unlock icon map (do nothing)', () => {
    const configA: ISerializedConfig = {
      isIconMapUnlocked: true,
      subscriptionTemplates: []
    };
    const merged = mergeConfig(configA, undefined, false)!;
    expect(merged).toBe(configA);
  });

  it('should unlock icon map (replace)', () => {
    const configB: ISerializedConfig = {
      isIconMapUnlocked: true,
      subscriptionTemplates: []
    };
    const merged = mergeConfig(undefined, configB, false)!;
    expect(merged).toBe(configB);
  });

  it('should unlock icon map (merge)', () => {
    const configA: ISerializedConfig = {
      isIconMapUnlocked: false,
      subscriptionTemplates: []
    };
    const configB: ISerializedConfig = {
      isIconMapUnlocked: true,
      subscriptionTemplates: []
    };
    const merged = mergeConfig(configA, configB, false)!;
    expect(merged.isIconMapUnlocked).toBe(configB.isIconMapUnlocked);
    expect(merged.subscriptionTemplates!.length).toBe(0);
  });

  it('should unlock icon map and have 2 subscription templates (merged)', () => {
    const configA: ISerializedConfig = {
      isIconMapUnlocked: false,
      subscriptionTemplates: [
        {
          name: 'Subscription A',
          version: '1.0'
        },
        {
          name: 'Subscription B',
          version: '1.0'
        }
      ]
    };
    const configB: ISerializedConfig = {
      isIconMapUnlocked: true,
      subscriptionTemplates: [
        {
          name: 'Subscription A',
          version: '2.0'
        }
      ]
    };
    const merged = mergeConfig(configA, configB, false)!;
    expect(merged.isIconMapUnlocked).toBe(configB.isIconMapUnlocked);
    expect(merged.subscriptionTemplates!.length).toBe(2);
    expect(merged.subscriptionTemplates![0]).toEqual(configB.subscriptionTemplates![0]);
    expect(merged.subscriptionTemplates![1]).toEqual(configA.subscriptionTemplates![1]);
  });

  it('should unlock icon map and have 3 subscription templates (merged)', () => {
    const configA: ISerializedConfig = {
      isIconMapUnlocked: false,
      subscriptionTemplates: [
        {
          name: 'Subscription A',
          version: '1.0'
        },
        {
          name: 'Subscription B',
          version: '1.0'
        }
      ]
    };
    const configB: ISerializedConfig = {
      isIconMapUnlocked: true,
      subscriptionTemplates: [
        {
          name: 'Subscription B',
          version: '2.0'
        },
        {
          name: 'Subscription C',
          version: '1.0'
        }
      ]
    };
    const merged = mergeConfig(configA, configB, false)!;
    expect(merged.isIconMapUnlocked).toBe(configB.isIconMapUnlocked);
    expect(merged.subscriptionTemplates!.length).toBe(3);
    expect(merged.subscriptionTemplates![0]).toEqual(configA.subscriptionTemplates![0]);
    expect(merged.subscriptionTemplates![1]).toEqual(configB.subscriptionTemplates![0]);
    expect(merged.subscriptionTemplates![2]).toEqual(configB.subscriptionTemplates![1]);
  });

  it('should unlock icon map and have 2 subscription templates (merged, prune)', () => {
    const configA: ISerializedConfig = {
      isIconMapUnlocked: false,
      subscriptionTemplates: [
        {
          name: 'Subscription A',
          version: '1.0'
        },
        {
          name: 'Subscription B',
          version: '1.0'
        }
      ]
    };
    const configB: ISerializedConfig = {
      isIconMapUnlocked: true,
      subscriptionTemplates: [
        {
          name: 'Subscription B',
          version: '2.0'
        },
        {
          name: 'Subscription C',
          version: '1.0'
        }
      ]
    };
    const merged = mergeConfig(configA, configB, true)!;
    expect(merged.isIconMapUnlocked).toBe(configB.isIconMapUnlocked);
    expect(merged.subscriptionTemplates!.length).toBe(2);
    expect(merged.subscriptionTemplates![0]).toEqual(configB.subscriptionTemplates![0]);
    expect(merged.subscriptionTemplates![1]).toEqual(configB.subscriptionTemplates![1]);
  });
});

describe('mergeDataSet', () => {
  it('should have 1 user, 1 label', () => {
    const dataSetA: ISerializedDataSet = {
      data: {
        '1': [
          { id: '1', text: 'Label 1A' }
        ]
      }
    };
    const dataSetB: ISerializedDataSet = {
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
    const dataSetA: ISerializedDataSet = {
      data: {
        '1': [
          { id: '1', text: 'Label 1A' }
        ]
      }
    };
    const dataSetB: ISerializedDataSet = {
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
    const dataSetA: ISerializedDataSet = {
      data: {
        '1': [
          { id: '1', text: 'Label 1A' }
        ]
      }
    };
    const dataSetB: ISerializedDataSet = {
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
    const dataSetA: ISerializedDataSet = {
      data: {
        '1': [
          { id: '1', text: 'Label 1A' }
        ]
      }
    };
    const dataSetB: ISerializedDataSet = {
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
    const dataSetA: ISerializedDataSet = {
      data: {
        '1': [
          { id: '1', text: 'Label 1A' }
        ]
      }
    };
    const dataSetB: ISerializedDataSet = {
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
    const dataSetA: ISerializedDataSet = {
      data: {
        '1': [
          { id: '1', text: 'Label 1A' }
        ]
      }
    };
    const dataSetB: ISerializedDataSet = {
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
    const dataSetA: ISerializedDataSet = {
      data: {
        '1': [
          { text: 'Label 1A', reason: 'Reason A' },
          { text: 'Label 1A', reason: 'Reason B' },
          { text: 'Label 1B' }
        ]
      }
    };
    const dataSetB: ISerializedDataSet = {
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
      { name: 'A', version: '1.0', url: 'URL_1', enabled: true }
    ];
    const subscriptionsB: ISerializedSubscription[] = [
      { name: 'B', version: '1.0', url: 'URL_1', enabled: false }
    ];
    const merged = mergeSubscriptions(subscriptionsA, subscriptionsB, false);
    expect(merged.length).toBe(1);
    expect(merged[0]).toEqual(subscriptionsB[0]);
  });

  it('should have 2 subscriptions', () => {
    const subscriptionsA: ISerializedSubscription[] = [
      { name: 'A', version: '1.0', url: 'URL_1', enabled: true }
    ];
    const subscriptionsB: ISerializedSubscription[] = [
      { name: 'B', version: '1.0', url: 'URL_2', enabled: false }
    ];
    const merged = mergeSubscriptions(subscriptionsA, subscriptionsB, false);
    expect(merged.length).toBe(2);
    expect(merged[0]).toBe(subscriptionsA[0]);
    expect(merged[1]).toBe(subscriptionsB[0]);
  });

  it('should have 2 subscriptions', () => {
    const subscriptionsA: ISerializedSubscription[] = [
      { name: 'A', version: '1.0', url: 'URL_1', enabled: true }
    ];
    const subscriptionsB: ISerializedSubscription[] = [
      { name: 'B', version: '1.0', url: 'URL_1', enabled: false },
      { name: 'C', version: '1.0', url: 'URL_2', enabled: true }
    ];
    const merged = mergeSubscriptions(subscriptionsA, subscriptionsB, false);
    expect(merged.length).toBe(2);
    expect(merged[0]).toEqual(subscriptionsB[0]);
    expect(merged[1]).toBe(subscriptionsB[1]);
  });

  it('should have 3 subscriptions', () => {
    const subscriptionsA: ISerializedSubscription[] = [
      { name: 'A', version: '1.0', url: 'URL_1', enabled: true }
    ];
    const subscriptionsB: ISerializedSubscription[] = [
      { name: 'B', version: '1.0', url: 'URL_2', enabled: false },
      { name: 'C', version: '1.0', url: 'URL_3', enabled: true }
    ];
    const merged = mergeSubscriptions(subscriptionsA, subscriptionsB, false);
    expect(merged.length).toBe(3);
    expect(merged[0]).toBe(subscriptionsA[0]);
    expect(merged[1]).toBe(subscriptionsB[0]);
    expect(merged[2]).toBe(subscriptionsB[1]);
  });

  it('should have 1 subscription', () => {
    const subscriptionsA: ISerializedSubscription[] = [
      { name: 'A', version: '1.0', url: 'URL_1', enabled: true }
    ];
    const subscriptionsB: ISerializedSubscription[] = [
      { name: 'B', version: '1.0', url: 'URL_2', enabled: false }
    ];
    const merged = mergeSubscriptions(subscriptionsA, subscriptionsB, true);
    expect(merged.length).toBe(1);
    expect(merged[0]).toBe(subscriptionsB[0]);
  });

  it('should have 2 subscriptions', () => {
    const subscriptionsA: ISerializedSubscription[] = [
      { name: 'A', version: '1.0', url: 'URL_1', enabled: true }
    ];
    const subscriptionsB: ISerializedSubscription[] = [
      { name: 'B', version: '1.0', url: 'URL_2', enabled: false },
      { name: 'C', version: '1.0', url: 'URL_3', enabled: true }
    ];
    const merged = mergeSubscriptions(subscriptionsA, subscriptionsB, true);
    expect(merged.length).toBe(2);
    expect(merged[0]).toBe(subscriptionsB[0]);
    expect(merged[1]).toBe(subscriptionsB[1]);
  });

  it('should have 3 subscriptions and preserve the sorting', () => {
    const subscriptionsA: ISerializedSubscription[] = [
      { name: 'A', version: '1.0', url: 'URL_1', enabled: true },
      { name: 'B', version: '1.0', url: 'URL_2', enabled: false }
    ];
    const subscriptionsB: ISerializedSubscription[] = [
      { name: 'B', version: '1.1', url: 'URL_2', enabled: true },
      { name: 'A', version: '1.1', url: 'URL_1', enabled: false },
      { name: 'C', version: '1.2', url: 'URL_3', enabled: true }
    ];
    const merged = mergeSubscriptions(subscriptionsA, subscriptionsB, false);
    expect(merged.length).toBe(3);
    expect(merged[0]).toEqual(subscriptionsB[0]);
    expect(merged[1]).toEqual(subscriptionsB[1]);
    expect(merged[2]).toBe(subscriptionsB[2]);
  });
});
