import styles from './Modal.module.css';
import ReactModal from 'react-modal'; // Renamed the imported Modal to ReactModal to resolve the conflict.

function CustomModal({ isOpen, setIsOpen, children }) {
  const handleClose = () => {
    setIsOpen(false);
  };

  const customStyles = {
    content: {
      width: '95%',
      maxWidth: '572px',
      top: '50%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-50%)',
      height: 'fit-content',
      maxHeight: '90vh',
      background: 'rgba(239, 239, 239, 0.85)',
      border: '0',
      borderRadius: '15px',
      padding: '2rem',
    },
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={true}
      style={customStyles}
    >
      {children}
    </ReactModal>
  );
}

export default CustomModal;
