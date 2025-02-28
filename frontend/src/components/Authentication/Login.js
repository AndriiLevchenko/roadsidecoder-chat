import { useState } from "react";
import { Link } from "react-router-dom";
//import useLogin from "../../hooks/useLogin.js";
import { useToast } from '@chakra-ui/react'
import {useHistory} from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import {Button} from "@chakra-ui/react";

const Login = () => {
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



        //await login(username, password);
    };

    return (

            <div >
                <h1 className='display1'>
                    Login
                    <span className='text-blue-500'> ChatApp</span>
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
                    <Link to='/signup' className=''>
                        {"Don't"} have an account?
                    </Link>

                    <div className='buttons-login'>
                        <Button className='button' disabled={loading} isLoading={loading} onClick={submitHandler}>
                            {loading ? <span className='loading loading-spinner '></span> : "Login"}
                        </Button>
                        <Button
                            variant="solid"
                            className='button'
                            width="100%"
                            onClick={() => {
                                setEmail("guest@example.com");
                                setPassword("12345678");
                            }}
                        >
                            Guest Credentials
                        </Button>
                    </div>
                </form>
            </div>

    );
};
export default Login;

// STARTER CODE FOR THIS FILE
// const Login = () => {
// 	return (
// 		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
// 			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
// 				<h1 className='text-3xl font-semibold text-center text-gray-300'>
// 					Login
// 					<span className='text-blue-500'> ChatApp</span>
// 				</h1>

// 				<form>
// 					<div>
// 						<label className='label p-2'>
// 							<span className='text-base label-text'>Username</span>
// 						</label>
// 						<input type='text' placeholder='Enter username' className='w-full input input-bordered h-10' />
// 					</div>

// 					<div>
// 						<label className='label'>
// 							<span className='text-base label-text'>Password</span>
// 						</label>
// 						<input
// 							type='password'
// 							placeholder='Enter Password'
// 							className='w-full input input-bordered h-10'
// 						/>
// 					</div>
// 					<a href='#' className='text-sm  hover:underline hover:text-blue-600 mt-2 inline-block'>
// 						{"Don't"} have an account?
// 					</a>

// 					<div>
// 						<button className='btn btn-block btn-sm mt-2'>Login</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
// export default Login;
