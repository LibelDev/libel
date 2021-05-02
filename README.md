# Libel

Label users on LIHKG

- [Libel](#libel)
  - [Features](#features)
  - [Installation](#installation)
  - [Why](#why)
  - [Philosophy](#philosophy)
  - [Subscription](#subscription)
    - [Provider](#provider)
      - [Label list](#label-list)
        - [Format](#format)
        - [Sample](#sample)
    - [Consumer](#consumer)
  - [Development](#development)
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

1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Visit [https://kitce.github.io/libel/dist/libel.user.js](https://kitce.github.io/libel/dist/libel.user.js)
3. Click **Install** / **Reinstall**
4. Go back to LIHKG and reload the page

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

If you want to share your findings and contribute to the community, you may want to be a label list **[provider](#provider)**.

If you want to know more about some (in)famous users from others, you may want to subscribe to some label lists, i.e. becoming a label list **[consumer](#consumer)**.

(or you could be both at the same time.)

If you think labels provided by others could be biased, you may want to build up your personal labels database.

**Note: To boost the growth of the community, we hope to have a directory of verified subscrptions in the future, but it definitely needs your help. (The word "verified" means the "integrity", not the "quality". the [provider](#provider) should be responsible to it.)**

### Provider

To be a **provider**, you have to prepare a label list file (a.k.a **subscription**) in [JSON](https://www.json.org/json-en.html) format, and host it on the internet publicly for others to subscribe.

Please follow the following format and take reference from the sample.

**Note: There will be a [content management system](https://en.wikipedia.org/wiki/Content_management_system) soon**

#### Label list

##### Format

```ts
interface Subscription {
  // the display name
  name: string;
  // the current version (for future use)
  version: string;
  // (optional) the website introducing this label list
  homepage?: string;
  // the main labels data
  data: {
    // `user` is the user ID on LIHKG
    [user: string]: Label[];
  };
}

interface Label {
  // label text
  text: string;
  // (optional) a short text describing the reason
  reason?: string;
  // (optional) the page link of the label
  // NOTE: deprecated, for backward compatability only
  url?: string;
  // the date of the label being added (for future use)
  date?: number;
  // (optional) the precise source for referring to the reason
  // NOTE: this has replaced the above `url` property
  source?: {
    // the thread number
    thread: string;
    // the page number
    page: number;
    // the comment number
    messageNumber: string;
  };
}
```

##### Sample

```json
{
  "name": "Sample 1",
  "version": "1.0",
  "homepage": "https://github.com/kitce/libel",
  "data": {
    "23094": [
      {
        "text": "Test 1.1",
        "reason": "Test 1.1 Reason",
        "url": "https://lihkg.com/profile/23094",
        "date": 0,
        "source": {
          "thread": "1880412",
          "page": 1,
          "messageNumber": "1"
        }
      }
    ]
  }
}
```

More samples can be found in [`data/mock/subscriptions`](https://github.com/kitce/libel/tree/master/data/mock/subscriptions)

### Consumer

As a consumer, you just need to find the available subscriptions and add them into settings.

## Development

For a smooth development experience, you may want to execute these commands simultaneously

### Build

```bash
$ yarn dev
```

1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Visit [http://localhost:8080/libel.proxy.user.js](http://localhost:8080/libel.proxy.user.js)
3. Click **Install** / **Reinstall**
4. Go back to LIHKG and reload the page

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

Distributable files will be available in `/dist`

## Disclaimer

This project only provides technical support for the [features](#features) mentioned above. The owner and contributors do not assume any legal responsibilities caused by the users. Users should be aware of and take the risks.

## License

MIT License
