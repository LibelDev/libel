import classNames from 'classnames';
import { format } from 'date-fns';
import React from 'react';
import { DISPLAY_DATE_FORMAT } from '../../constants/label';
import type { IPost } from '../../types/lihkg';
import Icon from '../Icon/Icon';
import { IconName } from '../Icon/types';
import Username from '../Username/Username';
import styles from './BlockquoteMessageInfo.module.scss';

/**
 * original props
 */
interface IProps {
  post: IPost;
  inline?: boolean;
  highlight?: boolean;
}

/**
 * component props
 */
type TComponentProps = TComponentPropsWithoutRef<'small', IProps>;

/**
 * `BlockquoteMessageInfo` props
 */
type TProps = IProps & TComponentProps;

const BlockquoteMessageInfo: React.FunctionComponent<TProps> = (props) => {
  const { className, post, inline, highlight, ...otherProps } = props;

  const { user } = post;
  const date = format(post.reply_time * 1000, DISPLAY_DATE_FORMAT);

  return (
    <small
      className={
        classNames(
          className,
          styles.blockquoteMessageInfo,
          {
            [styles.highlight]: highlight
          }
        )
      }
      {...otherProps}
    >
      <Icon className={styles.icon} icon={IconName.FormatQuoteClose} />
      <span className={styles.messageNumber}>#{post.msg_num}</span>
      <Username user={user} />
      <span className={styles.date}>{date}</span>
    </small>
  );
};

BlockquoteMessageInfo.displayName = 'BlockquoteMessageInfo';

export const createContainer = (inline = false) => {
  const tagName = inline ? 'span' : 'div';
  const container = document.createElement(tagName);
  container.classList.add(styles.container);
  if (inline) {
    container.classList.add(styles.inline);
  }
  return container;
};

export default BlockquoteMessageInfo;
