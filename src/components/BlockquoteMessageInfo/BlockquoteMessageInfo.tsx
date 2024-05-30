import classNames from 'classnames';
import { format } from 'date-fns';
import React from 'react';
import { DISPLAY_DATE_FORMAT } from '../../constants/label';
import useResponseCache from '../../hooks/useResponseCache';
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
  const { className, post, inline, ...otherProps } = props;

  const date = format(post.reply_time * 1000, DISPLAY_DATE_FORMAT);

  const cache = useResponseCache();
  const poster = cache?.getCurrentThreadPoster();

  return (
    <small
      className={
        classNames(
          className,
          styles.blockquoteMessageInfo,
          {
            [styles.highlight]: poster?.user_id === post.user.user_id
          }
        )
      }
      {...otherProps}
    >
      <Icon className={styles.icon} icon={IconName.FormatQuoteClose} />
      <span className={styles.messageNumber}>#{post.msg_num}</span>
      <Username user={post.user} />
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
