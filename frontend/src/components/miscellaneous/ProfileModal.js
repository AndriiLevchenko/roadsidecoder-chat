import { ReactComponent as EyeIcon } from './../../images/eye-svgrepo.svg';
import Closeicon from "../../images/Closeicon";
import {ChatState} from "../../Context/ChatProvider";
import React, {useEffect, useState} from "react";

const ProfileModal = ({ user,  children, setOpenAvatar }) => {
    const { openProfileModal, setOpenProfileModal} = ChatState();
    const [userFromLocalstorage, setUserFromLocalstorage] = useState(user);
    console.log("user = ", user);
    console.log("userFromLocalstorage = ", userFromLocalstorage);
    console.log("props = ", window.props);

    // useEffect(()=> {
    //     const userFromLocalstorageTime = JSON.parse(localStorage.getItem("userInfo"));
    //     setUserFromLocalstorage(userFromLocalstorageTime);
    // },[user]);
    return (
        <>
            {children
                 ? <span style={{background: "#fbfe0f", width: "49px", height: "40px", }} >{children}</span>
                 : <button onClick={setOpenProfileModal}  type='button' className='icon_button'  >
                         <span className='span_avatar'>
                              <img className='imgAvatar' name={user.name} src={user.pic} alt='imgAvatar'/>
                         </span>
                   </button>
            }
            { openProfileModal ? <div className=' timeProfile Time222' >
                <div className = 'modalContent' >
                    <section className='modal_section' >
                        <div className = 'modal_header'>
                            {userFromLocalstorage.name}
                        </div>
                        <button className='css-1ik4h6n buttonClose' type='button' aria-label='Close' onClick={()=>{setOpenProfileModal(false); !!setOpenAvatar && setOpenAvatar(false); }} ><Closeicon /></button>
                        <div className='modal_body'>
                            <img className='imgModal' alt={userFromLocalstorage.name}  src={userFromLocalstorage.pic} />
                            <p className='textLarge' > Email: {userFromLocalstorage.email} </p>
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
