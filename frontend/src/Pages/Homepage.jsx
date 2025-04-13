import React, {useEffect, useState} from 'react'
import axios from "axios";
//import {Box} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/Signup";
import {useHistory} from "react-router-dom";


const Homepage = () => {
    const history = useHistory();
    const [LoginSignup, setLoginSignup] = useState(true);
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if(user) history.push("/chats");
    },[history]);
    return (
        <div className='login_signup_container' >
            <div className='login_signup_box'>
                <h1>Chats</h1>
            </div>
            <div className='login_signup_buttons_box'>
                <div variant="soft-rounded">
                    <div className="navigation">
                        <div className={`navigation-li ${LoginSignup ? 'active' : ''}`}> <button onClick={()=>setLoginSignup(!LoginSignup)}> Login </button> </div>
                        <div className={`navigation-li ${LoginSignup ?  '' : 'active'}`}> <button onClick={()=>setLoginSignup(!LoginSignup)}> SignUp </button> </div>
                    </div>
                </div>
            </div>
            <div  className='loginFormBlock'>{ LoginSignup ? <Login setLoginSignup={setLoginSignup}/> : <SignUp setLoginSignup={setLoginSignup} /> }</div>
        </div>
    )
}
export default Homepage
