import Modal from './Modal.jsx';

export default function ConfirmDialog({
  open,
  title,
  subtitle,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
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
          <button className="btn ghost" onClick={onClose}>{cancelLabel}</button>
          <button className={'btn ' + (danger ? 'danger' : 'primary')} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </>
      }
    />
  );
}
