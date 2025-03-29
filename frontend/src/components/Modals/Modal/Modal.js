import React, { useState } from 'react';
import { ModalWrapper, ModalContent, CloseButton } from './ModalStyles';

const Modal = ({ isOpen, onClose, text, color }) => {
    return (
        <>
            {isOpen && (
                <ModalWrapper>
                    <ModalContent>
                        <p style={{margin: "15px 0 15px 0", color: `${color}`}}>{text}</p>
                        <CloseButton onClick={onClose}>X</CloseButton>
                    </ModalContent>
                </ModalWrapper>
            )}
        </>
    );
};

export default Modal;
