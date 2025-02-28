import { ViewIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalCloseButton,
    useDisclosure,
    IconButton,
} from "@chakra-ui/react";
import { ReactComponent as EyeIcon } from './../../images/eye-svgrepo.svg';

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <button type='button' className='' onClick={onOpen} >
                    <EyeIcon className = 'icon chakra-icon' focusable="false" aria-hidden="true" />
                </button>
            )}
            <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />

                <div className = 'modalContent'>
                    <section className='modalSection' role="dialog" id="chakra-modal-:rf:" tabIndex="-1" aria-modal="true" >
                        <div className = 'modalHeader'>
                            {user.name}
                        </div>
                        <ModalCloseButton />
                        <div className='modalBody'>
                            <img className='imgModal' alt={user.name}  src={user.pic} />
                            <p className='textLarge' > Email: {user.email} </p>
                        </div>
                        <div className='modalFooter'>
                            <button className='button' onClick={onClose}>Close</button>
                        </div>
                    </section>
                </div>

            </Modal>
        </>
    )
}
export default ProfileModal
