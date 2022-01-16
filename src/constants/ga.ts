export const id = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID!;

export enum EventName {
  AddLabel = 'add_label',
  EditLabel = 'edit_label',
  RemoveLabel = 'remove_label',
  AddSubscription = 'add_subscription',
  RemoveSubscription = 'remove_subscription',
  CloudSync = 'cloud_sync'
}
