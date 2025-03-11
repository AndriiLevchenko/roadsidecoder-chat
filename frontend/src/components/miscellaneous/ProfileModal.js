import {
    Modal,
    useDisclosure,
    IconButton, background,
} from "@chakra-ui/react";
import { ReactComponent as EyeIcon } from './../../images/eye-svgrepo.svg';
import Addicon from "../../images/Addicon";
import Closeicon from "../../images/Closeicon";
import {useState} from "react";
import {ChatState} from "../../Context/ChatProvider";

const ProfileModal = ({ user,  children }) => {
    //const { isOpen, onOpen, onClose } = useDisclosure();
    //const [modelProfileOpen, setModelProfileOpen] = ChatState();
    const { setSelectedChat, chats, setChats, notification, setNotification, modelProfileOpen, setModelProfileOpen, openProfileModal, setOpenProfileModal} = ChatState();
    console.log("user = ", user);
    console.log("children = ", children);
    console.log("openProfileModal = ", openProfileModal);
    //window.props = [];
    console.log("props = ", window.props);


    return (
        <>
            {children
                 ? <span style={{background: "#fbfe0f", width: "49px", height: "40px", }} >{children}</span>
                 : <button onClick={setOpenProfileModal}  style={{background: "#32fbb0", color: "red"}}  type='button' className=''  >
                        <EyeIcon className = 'icon chakra-icon' focusable="false" aria-hidden="true" />
                   </button>
            }
            { openProfileModal ? <div className=' timeProfile Time222' >
                <div className = 'modalContent' >
                    {/*<section className='modalSection' role="dialog" id="chakra-modal-:rf:" tabIndex="-1" aria-modal="true" >*/}
                    <section className='modalSection' >
                        <div className = 'modalHeader'>
                            {user.name}
                        </div>
                        <button className='css-1ik4h6n buttonClose' type='button' aria-label='Close' ><Closeicon setOpenProfileModal={setOpenProfileModal} /></button>
                        <div className='modalBody'>
                            <img className='imgModal' alt={user.name}  src={user.pic} />
                            <p className='textLarge' > Email: {user.email} </p>
                        </div>
                        <div className='modalFooter'>
                            <button className='button' onClick={()=>setOpenProfileModal(false)}>Close</button>
                        </div>
                    </section>
                </div>

            </div>  : null}
        </>
    )
}
export default ProfileModal
