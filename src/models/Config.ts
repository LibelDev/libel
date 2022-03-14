import { immerable } from 'immer';
import { ISubscriptionTemplate } from './Subscription';

export interface ISerializedConfig {
  isIconMapUnlocked: boolean;
  subscriptionTemplates: ISubscriptionTemplate[];
}

export interface IConfig extends ISerializedConfig { }

class Config implements IConfig {
  [immerable] = true;
  isIconMapUnlocked: boolean;
  subscriptionTemplates: ISubscriptionTemplate[] = [];

  constructor (isIconMapUnlocked?: boolean, subscriptionTemplates?: ISubscriptionTemplate[]) {
    this.isIconMapUnlocked = isIconMapUnlocked || false;
    this.subscriptionTemplates = subscriptionTemplates || [];
  }

  static factory () {
    return new Config();
  }

  static deserialize (config: Config | IConfig) {
    if (config instanceof Config) {
      return config;
    }
    const { isIconMapUnlocked, subscriptionTemplates } = config;
    return new Config(isIconMapUnlocked, subscriptionTemplates);
  }

  static parseFromStorage (json: string): IConfig {
    const { isIconMapUnlocked, subscriptionTemplates } = JSON.parse(json);
    return {
      isIconMapUnlocked: JSON.parse(isIconMapUnlocked),
      subscriptionTemplates: JSON.parse(subscriptionTemplates)
    };
  }

  serialize (): ISerializedConfig {
    const { isIconMapUnlocked, subscriptionTemplates } = this;
    return {
      isIconMapUnlocked,
      subscriptionTemplates: [...subscriptionTemplates]
    };
  }
}

export default Config;
