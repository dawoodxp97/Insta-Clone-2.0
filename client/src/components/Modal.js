import React from "react";
import "./styles/Modal.css";
import { RiCloseFill } from "react-icons/ri";
function Modal(props) {
  const { closeModal } = props;

  return (
    <div className="modal_overlay">
      <div className="modal_content">
        {<RiCloseFill className="modal_close" onClick={closeModal} />}
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
