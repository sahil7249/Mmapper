const SpinnerModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default SpinnerModal;