## v3.1.0 (2022-03-20)

### Fix

- **label-item**: update style
- **label-item**: remove `color`
- **label-form**: remove label preview
- **store**: update storage instance before loading into the store
- **helpers**: update `merge.ts`
- **models**: update `Label#id` type

### Refactor

- update imports
- **helpers**: move rendering-related methods from `lihkg.ts` to `mutation.ts`

### Feat

- **file**: update `_export` to not compress to the JSON

## v3.0.0 (2022-03-20)

### Fix

- **label-list**: update label info list box-sizing
- **label-info**: remove shadow
- **dom**: apply `requestAnimationFrame` when handling mutations
- **label-list**: fix issue of `LabelInfo` popover being covered by other elements
- **file**: `download()` fails to download file
- **subscription**: remove default subscriptions in development mode
- **components**: inconsistent number of hooks between renderings
- **editor**: remove color column
- **store**: always load the storage into store after rehydrate
- **store**: remove unnecessary `storage.load()`
- **main**: app start performance (#2)
- **editor**: `ImageCell` rendering issue
- **components**: don't show cancel alert message
- **settings**: unbind `onClick` when it is disabled
- **store**: incorrect logic of loading data into the store
- **store**: update `config` and `meta` to the store as well
- **label-form**: incorrect form id

### Refactor

- **stylesheets**: use variables for colors
- **label-list**: update label item layout
- **constants**: update texts
- **models**: add `getShareURL()`
- **typings**: rename types
- **components**: update `BaseInput` and `ColorPicker` style
- **components**: update `LabelForm` color input field style
- **components**: prevent default
- **components**: rename variable
- **models**: update typings
- **components**: rename props and types
- **components**: typings
- **scss**: change class to selector
- **label**: change `sourceURL` to `shareURL`
- **components**: use `BaseInput` for import file button
- **models**: update typings
- **models**: update `Label` to fallback possible `null` values to `undefined`
- **components**: update `ColorPicker` prop `value`
- **constants**: update texts
- **main**: only import stylesheets in main app
- **components**: update `<ColorPicker /`> to support `border` and `rounded` props
- **schemas**: update label schema exports
- **components**: update `<LabelFormModal />`
- **components**: update `<Modal />`
- **components**: update `<Modal />`
- **components**: typings
- **settings**: update style
- **cloud-sync**: update last synced time hint text rendering logic
- **settings**: use `<SettingOptionButton />`
- **models**: update methods
- **gapi**: remove unnecessary variable
- **models**: add `Singleton` model
- **lihkg**: refactor `setIconMap()`
- **store**: update typings
- **store**: update selectors
- **store**: update typings
- **gapi**: revise typing
- **gapi**: singleton
- **ga**: update Google Analytics
- typings and exports

### Feat

- **label-list**: update label list layout
- **label-list**: update label list layout
- **label-list**: update label list layout
- **components**: update label list and label item info display
- **stylesheets**: add element mixin
- **settings**: add subscription maker
- **components**: add prop `fullWidth` to `ToggleButton`
- **editor**: remove row headers
- **merge**: update merge logic
- **models**: add property `id` to `Label`
- **counter**: accept optional argument `initial`
- **sniping**: move snipe button to beside the reply button
- **components**: update data set editor and manage data section
- **editor**: update data set editor
- **editor**: add data set editor (to be continued)
- **settings**: add stats to `<Footer />`
- **store**: add clear data (local/cloud) feature
- **gapi**: add hook `useGoogleAuthorization`
- **ga**: update event tags
- **file**: data compression
- **ga**: update event tags
- **ga**: update event tags
- **ga**: add event tags
- **cloud-sync**: data compression
- **label-form**: enable autocomplete on `text` and `reason` inputs

## v2.2.2 (2022-01-16)

### Fix

- **cloud-sync**: update sync logic

## v2.2.1 (2022-01-16)

### Fix

- **cloud-sync**: incorrect sync logic

## v2.2.0 (2022-01-16)

### Feat

- **announcement**: update new version announcement

## v2.1.0 (2022-01-16)

### Feat

- **sniping**: update sniping template
- **label-list**: move the label list to the same row on nickname
- **icon**: unlock icon map

## v2.0.2 (2022-01-11)

### Fix

- **subscription**: check `url` before adding subscription

## v2.0.1 (2022-01-10)

### Fix

- **cloud-sync**: set error to `null` after finish
