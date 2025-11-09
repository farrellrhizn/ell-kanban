import { type MouseEvent, type ReactNode, useEffect, useRef } from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps): JSX.Element => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose?.();
    };

    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (dialog && e.target === dialog) {
      onClose?.();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="modal-dialog"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="modal-close"
            aria-label="Tutup"
          >
            ×
          </Button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </dialog>
  );
};

export default Modal;
