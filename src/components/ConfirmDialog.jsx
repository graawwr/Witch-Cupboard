import Modal from './Modal.jsx';

export default function ConfirmDialog({
  open,
  title,
  subtitle,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  confirmDisabled = false,
  children,
  onConfirm,
  onClose,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      elevated
      title={title}
      subtitle={subtitle}
      footer={
        <>
          <button type="button" className="btn ghost" onClick={onClose}>{cancelLabel}</button>
          <button
            type="button"
            className={'btn ' + (danger ? 'danger' : 'primary')}
            disabled={confirmDisabled}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
