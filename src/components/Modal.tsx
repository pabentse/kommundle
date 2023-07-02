import React, { FC, MouseEvent } from "react";

interface ModalProps {
  active: boolean;
  image: string;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ active, image, onClose }) => {
  if (!active) {
    return null;
  }

  return (
    <div className="modal" onClick={onClose}>
      <img
        className="max-w-3/4 h-auto cursor-pointer"
        src={image}
        onClick={onClose}
        alt="Enlarged"
      />
    </div>
  );
};

export default Modal;
