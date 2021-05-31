import { render } from 'mustache';
import React from 'react';
import * as annnouncements from '../../templates/annnouncements';
import { IRelease } from '../../types/github';
import Announcement from '../Announcement/Announcement';

interface IProps {
  currentVersion: string;
  newVersion: string;
  release: IRelease;
}

const NewVersionAnnouncement: React.FunctionComponent<IProps> = (props) => {
  const message = render(annnouncements.newVersion, props);
  return (
    <Announcement dangerouslySetInnerHTML={{ __html: message }} />
  );
};

export default NewVersionAnnouncement;
