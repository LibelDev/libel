export const id = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID!;

export enum EventAction {
  Add = 'add',
  Edit = 'edit',
  Remove = 'remove',
  Reload = 'reload',
  CloudSync = 'cloud_sync'
}

export enum EventCategory {
  Label = 'label',
  Subscription = 'subscription',
  GoogleDrive = 'google_drive'
}
