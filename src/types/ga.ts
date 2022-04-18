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
  Close = 'close',
  Export = 'export',
  Import = 'import',
  Error = 'error'
}

export enum EventCategory {
  Label = 'label',
  Subscription = 'subscription',
  Modal = 'modal',
  Announcement = 'announcement',
  LabelForm = 'label_form',
  SubscriptionMaker = 'subscription_maker',
  Google = 'google'
}

export enum EventLabel {
  AddLabel = 'add_label',
  EditLabel = 'edit_label'
}
