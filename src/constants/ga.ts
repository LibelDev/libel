export const id = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID!;

export enum EventAction {
  Add = 'add',
  Edit = 'edit',
  Remove = 'remove',
  Reload = 'reload',
  CloudSync = 'cloud_sync',
  SignIn = 'sign_in',
  SignOut = 'sign_out',
  Snipe = 'snipe',
  Open = 'open',
  Close = 'close'
}

export enum EventCategory {
  Label = 'label',
  Subscription = 'subscription',
  Modal = 'modal',
  Announcement = 'announcement'
}

export enum EventLabel {
  GoogleDrive = 'google_drive',
  AddLabel = 'add_label',
  EditLabel = 'edit_label'
}
