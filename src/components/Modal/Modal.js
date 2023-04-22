import React from "react";
import "./Modal.scss";

const Modal = (props) => {
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleGetSelectedText = () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      return;
    } else {
      props.closeModal();
    }
  };

  return (
    <div onClick={handleGetSelectedText} className="modal-overlay active">
      <div onClick={handleModalClick} className="modal-container active">
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
