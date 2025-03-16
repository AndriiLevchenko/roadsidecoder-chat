import { useState } from "react";
import { useToast } from '@chakra-ui/react'
import {useHistory} from "react-router-dom/cjs/react-router-dom";
import axios from "axios";

const Login = (props) => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toast = useToast();
    const [loading, setLoading ] = useState(false);
    const handleClick = ()=> setShow(!show);
    const history = useHistory();
    //const { loading, login } = useLogin();

    const submitHandler = async () => {
        //e.preventDefault();
        setLoading(true);
        if (!email || !password) {
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                },
            };
            console.log('email password = ', email, password);
            const { data } = await axios.post(
                "http://localhost:5000/api/user/login",
                { email, password},
                config
            );
            console.log(data);
            toast({
                title: "Login successfull",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push("/chats");
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setLoading(false);
        }
    };

    return (

            <div >
                <h1 className='display1'>
                    Login
                    <b> ChatApp</b>
                </h1>

                <form>
                    <div className='form-group'>
                        <label className='label p-2'>
                            <span className='text-base text-white'>Username</span>
                        </label>
                        <input
                            type='text'
                            placeholder='Enter Email-username'
                            className='form-control'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className='label'>
                            <span className='text-base text-white'>Password</span>
                        </label>
                        <input
                            type='password'
                            placeholder='Enter Password'
                            className='form-control'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button onClick={()=>props.setLoginSignup(false)}  className='link_account'>
                        {"Don't"} have an account?
                    </button>

                    <div className='login_buttons'>
                        <button className=' button signup_button' disabled={loading} isLoading={loading} onClick={submitHandler}>
                            {loading ? <span className='loading loading-spinner '></span> : "Login"}
                        </button>
                        <button
                            className=' button'
                            variant="solid"
                            onClick={() => {
                                setEmail("guest@example.com");
                                setPassword("12345678");
                            }}
                        >
                            Guest
                        </button>
                    </div>
                </form>
            </div>
    );
};
export default Login;