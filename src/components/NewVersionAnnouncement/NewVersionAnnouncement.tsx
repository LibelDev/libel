import { render } from 'mustache';
import React from 'react';
import { publicURL } from '../../../config/config';
import { name } from '../../../package.json';
import * as TEXTS from '../../constants/texts';
import { versionUpdate } from '../../templates/announcements';
import { IRelease } from '../../types/github';
import { IconName } from '../../types/icon';
import Announcement from '../Announcement/Announcement';
import styles from './NewVersionAnnouncement.scss';

interface IProps {
  currentVersion: string;
  newVersion: string;
  release: IRelease;
}

const userScriptURL = `${publicURL}/${name}.user.js`;

const NewVersionAnnouncement: React.FunctionComponent<IProps> = (props) => {
  const { currentVersion, newVersion, release } = props;
  const oldVersionMessage = render(versionUpdate.oldVersionMessage, { currentVersion });
  const newVersionMessage = render(versionUpdate.newVersionMessage, { newVersion });
  return (
    <Announcement className={styles.newVersionAnnouncement} icon={IconName.InfoFill} forced>
      <strong>
        <a href={userScriptURL} target="_blank">{newVersionMessage}</a>
      </strong>
      （<a href={release.html_url} target="_blank">{TEXTS.CHANGE_LOG}</a>）
      <small>（{oldVersionMessage}）</small>
    </Announcement>
  );
};

export default NewVersionAnnouncement;
