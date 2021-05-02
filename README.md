# Libel

Label users on [LIHKG](https://lihkg.com/)

This project is derived from my previous LIHKG userscript project [**LIHKG Label Users**](https://gist.github.com/kitce/c7fe972b1657120919f0fb05047569ba).

In view of the features that I want to add being more and more, it is not easy to keep developing on the previous project codebase, so I decided to rewrite it from scratch.

If you are a general user, please jump to the [Installation](#installation) section and follow the steps to install the plugin. Please also read the [Subscrption](#subscription) section if you are interested.

If you are a developer, pull requests are welcome.

- [Libel](#libel)
  - [Features](#features)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Why](#why)
  - [Philosophy](#philosophy)
  - [Subscription](#subscription)
    - [Provider](#provider)
      - [Label list](#label-list)
        - [Sample](#sample)
        - [Format](#format)
    - [Consumer](#consumer)
  - [Development](#development)
    - [Install dependencies](#install-dependencies)
    - [Build](#build)
    - [SCSS module typings](#scss-module-typings)
    - [Mock data](#mock-data)
      - [Why the mock data is hosted on port `20630`?](#why-the-mock-data-is-hosted-on-port-20630)
  - [Distribution](#distribution)
    - [Build](#build-1)
  - [Disclaimer](#disclaimer)
  - [License](#license)
  
## Features
- [x] Labelling
- [x] Sniping
- [x] [Subscription](#subscription)
- [x] Export / import
- [ ] Cloud drive sync

## Installation

### Prerequisites

⚠ [**LIHKG Label Users**](https://gist.github.com/kitce/c7fe972b1657120919f0fb05047569ba) will no longer be in maintenance. ⚠

If you have installed any version of [**LIHKG Label Users**](https://gist.github.com/kitce/c7fe972b1657120919f0fb05047569ba) before, please export the data (for backup purpose) and disable/uninstall it before preceeding to the following installation steps.

Although the data of [**LIHKG Label Users**](https://gist.github.com/kitce/c7fe972b1657120919f0fb05047569ba) will be migrated into Libel automatically, we still recommend to always backup your data before updating or uninstalling any software.

### Steps

1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Visit [https://kitce.github.io/libel/dist/libel.user.js](https://kitce.github.io/libel/dist/libel.user.js)
3. Click **Install** / **Reinstall**
4. Go back to [LIHKG](https://lihkg.com/) and reload the page

## Why

We can't always remember the names of the (in)famous users and their histories, including what they had done or said.

Use this tool to help you to label them and record their histories (no matter good or bad); and to recognize them easily using the **labelling** feature. Spread their histories to the world in an easy way using the **sniping** feature.

You could also become a label list provider, others may subscribe to your label list using the **subscription** feature, and vice versa.

## Philosophy

**To label, or to libel, that is the question.  
標籤，還是誹謗，答案取決於你。**

[Label](https://dictionary.cambridge.org/dictionary/english/label)  
(verb) *to fasten a label to*  
(verb) *to label something or someone is also to name that thing’s or person’s character*

[Libel](https://dictionary.cambridge.org/dictionary/english/libel)  
(verb) *to write and publish something that contains bad and false things about a person*  
(verb) *to write or publish something which makes false or unfair statements that are likely to damage the reputation of a person or organization*

Every label should come with a reason and a source, otherwise it will just be a libel.

## Subscription

The **subscription** feature is a way to share labels data with others.

Think of it as the **filter lists** feature of your favorite ad block plugins (e.g. **Adblock Plus**, **uBlock Origin**). A filter list contains the definitions of some known ads on the internet, so that the plugin could know what should be blocked when you visit a website. There may be some built-in filter lists, or you could import some custom ones.

In Libel, **filter list** becomes **label list** (a.k.a **subscription**), someone creates a label list, then someone subscribe to it. A label list contains the labels that the provider puts on certain persons, so that the plugin will know what to display when you see them.

If you want to share your findings and contribute to the community, you may want to be a label list **[provider](#provider)**.

If you want to know more about some (in)famous users from others, you may want to subscribe to some label lists, i.e. to become a label list **[consumer](#consumer)**.

(or you could be both at the same time.)

If you think the labels data provided by others could be biased, you may want to build up your personal labels database.

**Note: To boost the growth of the community, we hope to have a directory of verified subscrptions in the future, but it definitely needs your help. (The word "verified" does not mean "quality" but "integrity". You, as the [provider](#provider), should be responsible to the quality of the label lists.)**

### Provider

As a **provider**, you have to prepare a label list file in [JSON](https://www.json.org/json-en.html) format, and host it on the internet publicly for others to subscribe.

Please refer to the following sample and format.

**Note: There will be a [content management system](https://en.wikipedia.org/wiki/Content_management_system) soon**

#### Label list

##### Sample

```json
// https://kitce.github.io/libel/data/mock/subscriptions/sample1.json
{
  "name": "(Sample) Libel認證【戇鳩】會員名單",
  "version": "1.0",
  "homepage": "https://github.com/kitce/libel",
  "data": {
    "35092": [
      {
        "text": "戇鳩",
        "reason": "認為【安心出行】冇問題",
        "url": "https://lihkg.com/thread/2412564/page/1",
        "date": 1619968323508,
        "source": {
          "thread": "2412564",
          "page": 1,
          "messageNumber": "1"
        }
      }
    ]
  }
}
```

##### Format

```ts
interface ISubscription {
  // the display name
  name: string;
  // the current version (for future use)
  version: string;
  // (optional) the website introducing this label list
  homepage?: string;
  // the main labels data
  data: {
    // `user` is the user ID on LIHKG
    [user: string]: ILabel[];
  };
}

interface ILabel {
  // label text
  text: string;
  // (optional) a short text describing the reason
  reason?: string;
  // (optional) the page link of the label
  // NOTE: deprecated, for backward compatability only
  url?: string;
  // (optional) the date of adding the label, in unix time (for future use)
  date?: number;
  // (optional) the precise source for referring to the reason
  // NOTE: this has replaced the above `url` property
  source?: ISource;
}

interface ISource {
  // the thread number
  thread: string;
  // the page number
  page: number;
  // the comment number
  messageNumber: string;
}
```

More samples can be found in [`data/mock/subscriptions`](https://github.com/kitce/libel/tree/master/data/mock/subscriptions)

### Consumer

As a consumer, you just need to find the available subscriptions and add them in the LIHKG settings menu.

For example, here is a [subscription sample](https://kitce.github.io/libel/data/mock/subscriptions/sample1.json), you may add this to the LIHKG settings menu and visit [this thread](https://lihkg.com/thread/2412564/page/1) to see how it works.

## Development

### Install dependencies

```bash
$ yarn
```

For a smooth development experience, you may want to execute the following commands simultaneously:

### Build

```bash
$ yarn dev
```

When `webpack-dev-server` completed the first compilation, follow these steps to test on [LIHKG](https://lihkg.com/):

1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Visit [http://localhost:8080/libel.proxy.user.js](http://localhost:8080/libel.proxy.user.js)
3. Click **Install** / **Reinstall**
4. Go back to [LIHKG](https://lihkg.com/) and reload the page

Whenever you made changes and `webpack-dev-server` recompiled the files, repeat step 2 to 4.

### SCSS module typings

```bash
$ yarn type:scss
# or
$ yarn type:scss:watch
```

### Mock data

```bash
$ yarn mock
```

#### Why the mock data is hosted on port `20630`?

To memorize [the death of Hong Kong](https://en.wikipedia.org/wiki/Hong_Kong_national_security_law) on 30/6/2020

## Distribution

### Build

```bash
yarn build
```

Distributable files will be available in [`/dist`](https://github.com/kitce/libel/tree/master/dist)

## Disclaimer

This project only provides technical support for the [features](#features) mentioned above. The owner and contributors do not assume any legal responsibilities caused by the users. Users should be aware of and take the risks.

## License

MIT License
