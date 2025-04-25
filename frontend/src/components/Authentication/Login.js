import { useState } from "react";
import {useHistory} from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import {ChatState} from "../../Context/ChatProvider";


const Login = (props) => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading ] = useState(false);
    const handleClick = ()=> setShow(!show);
    const history = useHistory();
    const { setCsrfToken, showToast  } = ChatState();
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!email || !password) {
            showToast (
                'fields'
            );
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                },
                withCredentials: true
            };
            console.log('email password = ', email, password);
            const { data } = await axios.post(
                "http://localhost:5000/api/user/login",
                { email, password},
                config
            );
            console.log(data);
            showToast (
                'loginsuccessfull'    //checked
            );
            localStorage.setItem("userInfo", JSON.stringify(data));
            setCsrfToken(data.csrfToken); // Отримуємо CSRF-токен з відповіді
            console.log("Отриманий CSRF-токен:", data.csrfToken);
            setLoading(false);
            history.push("/chats");
        } catch (error) {
            console.log("Login error = ", error.response.data.message);
            showToast (
                'loginerror'       //checked
            );
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
                            className='updateInput'
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
                            className='updateInput'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button onClick={()=>props.setLoginSignup(false)}  className='link_account'>
                        {"Don't"} have an account?
                    </button>
                    <div className='login_buttons'>
                        <button className=' button signup_button' disabled={loading} isLoading={loading} onClick={(e)=>submitHandler(e)}>
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