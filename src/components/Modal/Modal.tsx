import classNames from 'classNames';
import FocusTrap from 'focus-trap-react';
import React, { useCallback, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Key } from 'ts-key-enum';
import useElementID from '../../hooks/useElementID';
import Body from './Body';
import Footer from './Footer';
import Header from './Header';
import IDsContext from './IDsContext';
import styles from './Modal.module.scss';

interface IProps {
  /**
   * indicate the open state, default: false
   */
  open?: boolean;
  /**
   * show backdrop, default: true
   */
  backdrop?: boolean;
  /**
   * allow to press escape key to dismiss the modal, default: true
   */
  escape?: boolean;
  /**
   * allow to click on backdrop to dismiss the modal, default: true
   */
  fragile?: boolean;
  /**
   * close the modal
   */
  onClose: () => void;
}

interface IComponent {
  Header: typeof Header;
  Body: typeof Body;
  Footer: typeof Body;
}

export type TProps = IProps & React.ComponentPropsWithoutRef<'div'>;

type TModal = IComponent & React.FunctionComponent<TProps>;

const Modal: TModal = (props) => {
  const {
    id,
    className,
    children,
    open = false,
    backdrop = true,
    escape = true,
    fragile = true,
    onClose
  } = props;

  const ref = React.createRef<HTMLDivElement>();
  const backdropRef = React.createRef<HTMLDivElement>();
  const innerRef = React.createRef<HTMLDivElement>();

  const _id = id || useElementID(Modal.displayName!);

  const ids = useMemo(() => ({
    title: `${_id}-title`,
    body: `${_id}-body`
  }), [_id]);

  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = useCallback((event) => {
    if (fragile && event.target === backdropRef.current) {
      onClose();
    }
  }, [open, fragile, onClose]);

  const handleEscapeKeydown = useCallback((event: KeyboardEvent) => {
    if (open) {
      event.stopPropagation(); // prevent from dismissing the modals underneath
    }
    if (escape && event.key === Key.Escape && ref.current?.contains(document.activeElement)) {
      onClose();
    }
  }, [open, escape, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKeydown);
    return () => {
      document.removeEventListener('keydown', handleEscapeKeydown);
    };
  }, [handleEscapeKeydown]);

  if (!open) {
    return null;
  }

  return (
    ReactDOM.createPortal(
      <IDsContext.Provider value={ids}>
        <FocusTrap>
          <div
            ref={ref}
            id={_id}
            className={classNames(className, styles.modal)}
            role="dialog"
            aria-modal
            aria-labelledby={ids.title}
            aria-describedby={ids.body}
          >
            {
              backdrop && (
                <div
                  ref={backdropRef}
                  className={styles.backdrop}
                  onClick={handleBackdropClick}
                  aria-hidden
                />
              )
            }
            <div ref={innerRef} className={styles.inner}>
              {children}
            </div>
          </div>
        </FocusTrap>
      </IDsContext.Provider>,
      document.body
    )
  );
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

Modal.displayName = 'Modal';

export default Modal;
