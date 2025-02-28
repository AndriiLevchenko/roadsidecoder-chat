import React from 'react';
import styled from 'styled-components';
import "./ConfirmModal.css";


const ModalContainer = styled.div`
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 450px;  
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
`;

const ConfirmModal = ({ isOpen, onClose, content, onConfirm }) => {
    const handleConfirmAction = () => {
        onConfirm();
        onClose();
    };

    return (
        <ModalContainer className={"modal-container"} isOpen={isOpen}>
            <ModalContent>
                {content }
                <p>Are you sure you want to delete this group</p>
                <div className={"wrapper-buttons"}>
                    <Button onClick={handleConfirmAction}>Okay</Button>
                    <Button onClick={onClose}>Go back</Button>
                </div>
            </ModalContent>
        </ModalContainer>
    );
};

export default ConfirmModal;