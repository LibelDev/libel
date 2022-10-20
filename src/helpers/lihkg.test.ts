import Chance from 'chance';
import times from 'lodash/times';
import * as TEXTS from '../constants/texts';
import { Gender, IBlockedUser, LevelName } from '../types/lihkg';
import { mapBlockedUsersToDataSet } from './lihkg';

const chance = new Chance();

const generateBlockedUser = (id: string) => {
  const nickname = chance.name();
  const blockedUser: IBlockedUser = {
    user_id: id,
    nickname,
    level: '10',
    gender: Gender.M,
    status: '1',
    // create_time: chance.timestamp(),
    level_name: LevelName.Normal,
    is_following: chance.bool(),
    is_blocked: true,
    is_disappear: chance.bool(),
    is_newbie: chance.bool(),
    blocked_time: Math.round(chance.timestamp() / 1000),
    block_remark: {
      nickname,
      reason: chance.string()
    }
  };
  return blockedUser;
};

describe('mapBlockedUsersToDataSet', () => {
  it('should map blocked users to data set', () => {
    const blockedUsers = times(100, (index) => generateBlockedUser(`${index}`));
    const dataSet = mapBlockedUsersToDataSet(blockedUsers);
    const users = Object.keys(dataSet.data);
    expect(users.length).toEqual(blockedUsers.length);
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const blockedUser = blockedUsers[i];
      const labels = dataSet.data[user]!;
      expect(labels.length).toEqual(1);
      const label = labels[0];
      expect(label.id).toEqual('-1');
      expect(label.text).toEqual(TEXTS.BLOCKED_USER_DEFAULT_LABEL_TEXT);
      expect(blockedUser.blocked_time * 1000).toEqual(label.date);
      expect(blockedUser.block_remark.reason).toEqual(label.reason);
    }
  });
});
