import React, {useEffect, useState} from 'react'
import axios from "axios";
import {Box, Container} from "@chakra-ui/react";
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
        <Container maxW="xl" centerContent>
            <Box
                display="flex"
                justifyContent="center"
                p={3}
                bg="white"
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <h1   className='display1' fontSize="4xl" fontFamily="Work sans">
                    Chats
                </h1>
            </Box>
            <Box bg="white" w="100%" p={4}>
                <div  variant="soft-rounded">
                    <div className="navigation">
                        <div className={`navigation-li ${LoginSignup ? 'active' : ''}`}> <button onClick={()=>setLoginSignup(!LoginSignup)}> Login </button> </div>
                        <div className={`navigation-li ${LoginSignup ?  '' : 'active'}`}> <button onClick={()=>setLoginSignup(!LoginSignup)}> SignUp </button> </div>
                    </div>
                </div>
            </Box>
                            <div  className='loginFormBlock'>{ LoginSignup ? <Login /> : <SignUp /> }</div>
        </Container>
    )
}
export default Homepage
