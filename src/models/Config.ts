import { immerable } from 'immer';
import type { IBaseSubscription } from './Subscription';

export interface ISerializedConfig {
  /** @since 2.1.0 */
  isIconMapUnlocked: boolean;
  /** @since 3.1.0 */
  subscriptionTemplates?: IBaseSubscription[];
}

export interface IConfig extends ISerializedConfig { }

class Config implements IConfig {
  [immerable] = true;

  constructor (
    /** @since 2.1.0 */
    public isIconMapUnlocked: boolean = false,
    /** @since 3.1.0 */
    public subscriptionTemplates: IBaseSubscription[] = []
  ) { }

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
