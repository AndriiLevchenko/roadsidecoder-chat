import React from 'react';
import styled from 'styled-components';
import "./ConfirmModal.css";
import Closeicon from "../../../images/Closeicon";


const ModalContainer = styled.div`
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  // position: fixed;
  // top: 0;
  // left: 0;
  // width: 100%;
  // height: 100%;
  // background: #23ba3e;
  // justify-content: center;
  // align-items: center;
  // z-index: 999;
`;
//
// const ModalContent = styled.div`
//   // background: "#43ab0f";
//   // padding: 200px;
//   // border-radius: 8px;
//   // text-align: center;
//   // max-width: 450px;
// `;

// const Button = styled.button`
//   padding: 100px 200px;
//   margin: 0 5px;
//   cursor: pointer;
// `;

const ConfirmModal = ({ isOpen, onClose, content, onConfirm }) => {
    const handleConfirmAction = () => {
        onConfirm();
        onClose();
    };
    return (
        <ModalContainer className="modal-container " isOpen={isOpen}>
            <div className="modal_section modal-content">
                <button className='buttonClose' type='button' onClick={onClose} >
                    <Closeicon />
                </button>
                <p className="modal_header"> {content }</p>
                <div className=" buttons_yes_no">
                    <button className="button" onClick={handleConfirmAction}>YES</button>
                    <button className="button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </ModalContainer>
    );
};

export default ConfirmModal;