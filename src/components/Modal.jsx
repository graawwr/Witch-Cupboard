import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  elevated = false,
  modalClass = '',
  backdropClass = '',
}) {
  const titleId = useId();
  const subtitleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={
        'modal-backdrop'
        + (elevated ? ' modal-backdrop-elevated' : '')
        + (backdropClass ? ` ${backdropClass}` : '')
      }
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={subtitle ? subtitleId : undefined}
    >
      <div className={'modal' + (modalClass ? ` ${modalClass}` : '')}>
        <div className="modal-handle" />
        {title ? <div className="modal-title" id={titleId}>{title}</div> : null}
        {subtitle ? <div className="modal-sub" id={subtitleId}>{subtitle}</div> : null}
        {children}
        {footer ? <div className="modal-footer">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
