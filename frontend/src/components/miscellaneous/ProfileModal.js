import { ReactComponent as EyeIcon } from './../../images/eye-svgrepo.svg';
import Closeicon from "../../images/Closeicon";
import {ChatState} from "../../Context/ChatProvider";

const ProfileModal = ({ user,  children, setOpenAvatar }) => {
    const { openProfileModal, setOpenProfileModal} = ChatState();
    console.log("user = ", user);
    console.log("props = ", window.props);
    return (
        <>
            {children
                 ? <span style={{background: "#fbfe0f", width: "49px", height: "40px", }} >{children}</span>
                 : <button onClick={setOpenProfileModal}  type='button' className='icon_button'  >
                        <EyeIcon className = 'icon chakra-icon' focusable="false" aria-hidden="true" />
                   </button>
            }
            { openProfileModal ? <div className=' timeProfile Time222' >
                <div className = 'modalContent' >
                    {/*<section className='modal_section' role="dialog" id="chakra-modal-:rf:" tabIndex="-1" aria-modal="true" >*/}
                    <section className='modal_section' >
                        <div className = 'modal_header'>
                            {user.name}
                        </div>
                        <button className='css-1ik4h6n buttonClose' type='button' aria-label='Close' onClick={()=>{setOpenProfileModal(false); !!setOpenAvatar && setOpenAvatar(false); }} ><Closeicon /></button>
                        <div className='modal_body'>
                            <img className='imgModal' alt={user.name}  src={user.pic} />
                            <p className='textLarge' > Email: {user.email} </p>
                        </div>
                        <div className='modal_footer'>
                            <button className=' button signup_button'  onClick={()=>{setOpenProfileModal(false); !!setOpenAvatar && setOpenAvatar(false); }} >Close</button>
                        </div>
                    </section>
                </div>
            </div>  : null}
        </>
    )
}
export default ProfileModal
