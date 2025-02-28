import { Link } from "react-router-dom";
//import GenderCheckbox from "./GenderCheckbox";
import { useState } from "react";
import {Button, FormControl, Input} from "@chakra-ui/react";
//import useSignup from "../../hooks/useSignup.js";
import { useToast } from '@chakra-ui/react'
import {useHistory} from "react-router-dom/cjs/react-router-dom";
import axios from "axios";



const SignUp = () => {
    const [show, setShow] = useState(false);
    const handleClick =()=> setShow(!show);
    const toast = useToast();
    const history = useHistory();
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        pic: null
    });

    const [picLoading, setPicLoading ] = useState(false);

    // const handleCheckboxChange = (gender) => {
    //     setInputs({ ...inputs, gender });
    // };
    const submitHandler = async () => {
        setPicLoading(true);
        if (!inputs.name || !inputs.email || !inputs.password || !inputs.confirmPassword) {
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }
        if (inputs.password !== inputs.confirmPassword) {
            toast({
                title: "Passwords Do Not Match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        console.log(inputs.name, inputs.email, inputs.password, inputs.pic);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            };
            const { data } = await axios.post(
                "http://localhost:5000/api/user",
                { name: inputs.name, email: inputs.email, password: inputs.password, pic: inputs.pic},
                config
            );
            console.log(data);
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setPicLoading(false);
            history.push("/chats");
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
        }
    };

    const postDetails =(pics)=>{
        setPicLoading(true);
        if(pics === undefined) {
            toast({
                title: 'Picture is absent.',
                description: "Add a picture.",
                status: 'warning',
                duration: 9000,
                isClosable: true,
            })
            return;
        }
        console.log("pics = ", pics);
        if(pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            console.log("data = new Formadta = ", data);
            data.append("file", pics );
            data.append("upload_preset", "chat-app" );
            data.append("cloud_name", "dvxtzwyam" );
            fetch("https://api.cloudinary.com/v1_1/dvxtzwyam/image/upload", {
                method: "post",
                body: data
            }).then((res)=> res.json()).then((data)=> {
                const newInputs = {...inputs};
                console.log("newInputs = ", newInputs);
                console.log("data.url.toString() = ", data.url.toString());
                newInputs.pic = data.url.toString();
                setInputs( newInputs);
                console.log("data = ", data);
                setPicLoading(false);
            }).catch((err)=>{
                console.log("err = ", err);
                setPicLoading(false);
            });
        } else {
            toast({
                title: 'Picture is absent.',
                description: "Add a picture.",
                status: 'warning',
                duration: 9000,
                isClosable: true,
            });
            setPicLoading(false);
            return;
        }
    }

    return (
            <div className='loginFormBlock'>
                <h1 className='display1'>
                    Sign Up <span className='text-blue-500'> ChatApp</span>
                </h1>

                <form  id="first-name" isrequired = {'true'}>
                    <div className='form-group'>
                        <label className='label p-2'>
                            <span className='text-base text-white'>Name</span>
                        </label>
                        <input
                            type='text'
                            placeholder='Enter full name'
                            className='form-control'
                            value={inputs.name}
                            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className='label p-2 '>
                            <span className='text-base text-white'>Username</span>
                        </label>
                        <input
                            type='text'
                            placeholder='Enter Email-username'
                            className='form-control'
                            value={inputs.email}
                            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
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
                            value={inputs.password}
                            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className='label'>
                            <span className='text-base text-white'>Confirm Password</span>
                        </label>
                        <input
                            type='password'
                            placeholder='Confirm Password'
                            className='form-control'
                            value={inputs.confirmPassword}
                            onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
                        />
                    </div>

                    <FormControl>
                        <label className='label'>
                            <span className='text-base text-white'>Upload your picture</span>
                        </label>
                        <Input type="file" className='inputFile' p={1.5} accept="image/*" onChange={(e)=>postDetails(e.target.files[0])} />
                    </FormControl>
                    <div>
                        <Link to={"/login"} className='' href='#'> Already have an account? </Link>
                    </div>
                    <Button className='button' disabled={picLoading} onClick={()=>submitHandler()} isLoading = {picLoading}>
                        {picLoading ? <span className='loading loading-spinner'></span> : "Sign Up"}
                    </Button>

                </form>
                <Button
                    onClick={() =>
                        toast({
                            title: 'Account created.',
                            description: "We've created your account for you.",
                            status: 'success',
                            duration: 9000,
                            isClosable: true,
                        })
                    }
                >
                    Show Toast
                </Button>
            </div>
    );
};
export default SignUp;

// STARTER CODE FOR THE SIGNUP COMPONENT
// import GenderCheckbox from "./GenderCheckbox";

// const SignUp = () => {
// 	return (
// 		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
// 			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
// 				<h1 className='text-3xl font-semibold text-center text-gray-300'>
// 					Sign Up <span className='text-blue-500'> ChatApp</span>
// 				</h1>

// 				<form>
// 					<div>
// 						<label className='label p-2'>
// 							<span className='text-base label-text'>Full Name</span>
// 						</label>
// 						<input type='text' placeholder='John Doe' className='w-full input input-bordered  h-10' />
// 					</div>

// 					<div>
// 						<label className='label p-2 '>
// 							<span className='text-base label-text'>Username</span>
// 						</label>
// 						<input type='text' placeholder='johndoe' className='w-full input input-bordered h-10' />
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

// 					<div>
// 						<label className='label'>
// 							<span className='text-base label-text'>Confirm Password</span>
// 						</label>
// 						<input
// 							type='password'
// 							placeholder='Confirm Password'
// 							className='w-full input input-bordered h-10'
// 						/>
// 					</div>

// 					<GenderCheckbox />

// 					<a className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block' href='#'>
// 						Already have an account?
// 					</a>

// 					<div>
// 						<button className='btn btn-block btn-sm mt-2 border border-slate-700'>Sign Up</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
// export default SignUp;
