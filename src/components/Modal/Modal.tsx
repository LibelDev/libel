import classNames from 'classNames';
import FocusTrap from 'focus-trap-react';
import React, { useCallback, useEffect, useId, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Key } from 'ts-key-enum';
import Body from './Body';
import Footer from './Footer';
import Header from './Header';
import IDsContext from './IDsContext';
import styles from './Modal.module.scss';

interface IModal {
  Header: typeof Header;
  Body: typeof Body;
  Footer: typeof Body;
}

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

type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

export type TProps = IProps & TComponentProps;

type TModal = IModal & React.FunctionComponent<TProps>;

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

  const ref = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const _id = id || useId();
  const _ids = {
    title: `${_id}-title`,
    body: `${_id}-body`
  };

  const focusTrapOptions = useMemo(() => ({
    escapeDeactivates: escape
  }), [escape]);

  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = useCallback((event) => {
    if (open && fragile && event.target === backdropRef.current) {
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
      <IDsContext.Provider value={_ids}>
        <FocusTrap focusTrapOptions={focusTrapOptions}>
          <div
            ref={ref}
            id={_id}
            className={classNames(className, styles.modal)}
            role="dialog"
            aria-modal
            aria-labelledby={_ids.title}
            aria-describedby={_ids.body}
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
