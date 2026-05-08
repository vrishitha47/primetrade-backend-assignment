function Message({ message, type = 'success', onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`message message-${type}`} role="alert">
      <span>{message}</span>
      {onClose && (
        <button className="icon-button" type="button" onClick={onClose} aria-label="Dismiss message">
          x
        </button>
      )}
    </div>
  );
}

export default Message;
