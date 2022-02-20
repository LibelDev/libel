import { immerable } from 'immer';

export interface ISerializedConfig {
  isIconMapUnlocked: boolean;
}

export interface IConfig extends ISerializedConfig { }

class Config implements IConfig {
  [immerable] = true;
  isIconMapUnlocked: boolean;

  constructor (isIconMapUnlocked?: boolean) {
    this.isIconMapUnlocked = isIconMapUnlocked || false;
  }

  static factory () {
    return new Config();
  }

  static deserialize (config: Config | IConfig) {
    if (config instanceof Config) {
      return config;
    }
    const { isIconMapUnlocked } = config;
    return new Config(isIconMapUnlocked);
  }

  serialize (): ISerializedConfig {
    const { isIconMapUnlocked } = this;
    return {
      isIconMapUnlocked
    };
  }
}

export default Config;
