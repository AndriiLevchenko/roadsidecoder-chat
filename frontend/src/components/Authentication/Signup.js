import { useState } from "react";
import { useToast } from '@chakra-ui/react'
import {useHistory} from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import {ChatState} from "../../Context/ChatProvider";



const SignUp = (props) => {
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
    const {showToast } = ChatState();

    // const handleCheckboxChange = (gender) => {
    //     setInputs({ ...inputs, gender });
    // };
    const submitHandler = async (e) => {
        alert("SubmitHandler1");
        e.preventDefault();
        setPicLoading(true);
        if (!inputs.name || !inputs.email || !inputs.password || !inputs.confirmPassword) {
            alert("SubmitHandler2");
            // toast({
            //     title: "Please Fill all the Feilds",
            //     status: "warning",
            //     duration: 5000,
            //     isClosable: true,
            //     position: "bottom",
            // });
            showToast (
                'fields'
            );
            setPicLoading(false);
            return;
        }
        if (inputs.password !== inputs.confirmPassword) {
            showToast (
                'password'
            );
            setPicLoading(false);
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
            // toast({
            //     title: "Registration Successful",
            //     status: "success",
            //     duration: 5000,
            //     isClosable: true,
            //     position: "bottom",
            // });
            showToast (
                'newusercreated'
            );
            localStorage.setItem("userInfo", JSON.stringify(data));
            setPicLoading(false);
            history.push("/chats");
        } catch (error) {
            // toast({
            //     title: "Error Occured!",
            //     description: error.response.data.message,
            //     status: "error",
            //     duration: 5000,
            //     isClosable: true,
            //     position: "bottom",
            // });
            showToast (
                'error'
            );
            setPicLoading(false);
        }
    };

    const postDetails =(pics)=>{
        setPicLoading(true);
        if(pics === undefined) {
            // toast({
            //     title: 'Picture is absent.',
            //     description: "Add a picture.",
            //     status: 'warning',
            //     duration: 9000,
            //     isClosable: true,
            // })
            showToast (
                'pictureabsent'
            );
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
            // toast({
            //     title: 'Picture is absent.',
            //     description: "Add a picture.",
            //     status: 'warning',
            //     duration: 9000,
            //     isClosable: true,
            // });
            showToast (
                'pictureabsent'
            );
            setPicLoading(false);
            return;
        }
    }

    return (
            <div className='loginFormBlock'>
                <h1 className='display1'>
                    Sign Up <b> ChatApp</b>
                </h1>

                <form  id="first-name" >
                    <div className='form-group'>
                        <label className='label p-2'>
                            <span className='text-base text-white'>Name</span>
                        </label>
                        <input
                            type='text'
                            placeholder='Enter full name'
                            className='updateInput'
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
                            className='updateInput'
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
                            className='updateInput'
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
                            className='updateInput'
                            value={inputs.confirmPassword}
                            onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
                        />
                    </div>

                    <div className='input_upload'>
                        <label className='label'>
                            <span className='text-base text-white'>Upload your picture</span>
                        </label>
                        <input type="file" className='inputFile' accept="image/*" onChange={(e)=>postDetails(e.target.files[0])} />
                    </div>
                    <div>
                        <button onClick={()=>props.setLoginSignup(true)} className='link_account'> Already have an account? </button>
                    </div>
                    <div className='signup_button'>
                        <button className='button' disabled={picLoading} onClick={(e)=>submitHandler(e)} isLoading = {picLoading}>
                            {picLoading ? <span className='loading loading-spinner'></span> : "Sign Up"}
                        </button>
                    </div>

                </form>
                {/*<button className='update_button'*/}
                {/*    onClick={() =>*/}
                {/*        toast({*/}
                {/*            title: 'Account created.',*/}
                {/*            description: "We've created your account for you.",*/}
                {/*            status: 'success',*/}
                {/*            duration: 9000,*/}
                {/*            isClosable: true,*/}
                {/*        })*/}
                {/*    }*/}
                {/*>*/}
                {/*    Show Toast*/}
                {/*</button>*/}
            </div>
    );
};
export default SignUp;