import React from "react";
import "./Toast.css";
//import {list} from "./List";
import { useState, useEffect } from 'react';
import login from "../../components/Authentication/Login";
import CloseWhiteicon from "../../images/CloseWhiteicon";

const Toast = props => {
    const { toastList, position, autoDelete, autoDeleteTime } = props;
    const [list, setList] = useState(toastList);
    // const [autoDelete, setAutoDelete] = useState(false);
    // const [autoDeleteTime, setAutoDeleteTime] = useState(0);
    useEffect(() => {
        setList([...toastList]);
        // setAutoDelete(toastList[0].autoDelete);
        // setAutoDeleteTime(toastList[0].autoDeleteTime);
    }, [toastList]);
    console.log("autoDelete = ", autoDelete );
    console.log("autoDelete && toastList.length && list.length = ", autoDelete, toastList.length, list.length );
    const deleteToast = id => {
        const listItemIndex = list.findIndex(e => e.id === id);
        const toastListItem = toastList.findIndex(e => e.id === id);
        list.splice(listItemIndex, 1);
        toastList.splice(toastListItem, 1);
        setList([...list]);
    }
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         console.log("interval = ", interval, "autoDeleteTime = ", autoDeleteTime);
    //         //alert("autoDelete1");
    //         if (autoDelete && toastList.length && list.length) {
    //         // if (toastList.length && list.length) {
    //             alert("autoDelete2" + autoDelete);
    //             deleteToast(toastList[0].id);
    //         }
    //     }, autoDeleteTime);
    //     return () => {
    //         console.log(" clearInterval = ", interval);
    //         clearInterval(interval);
    //     }
    // }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            console.log("interval = ", interval, "autoDeleteTime = ", autoDeleteTime);
            if (autoDelete && toastList.length && list.length) {
                //alert("delete toast !!!!!!!!!!!!");
                deleteToast(toastList[0].id);
            }
        }, autoDeleteTime);

        return () => {
            console.log(" clearInterval = ", interval);
            clearInterval(interval);
        }

        // eslint-disable-next-line
    }, [toastList, autoDelete, autoDeleteTime, list]);

    return (
        <>
        <div className={`toast_notification-container ${position}`} >
            {
                list.map((toast, index) =>
                    <div
                        key={index}
                        className={`toast_notification toast_block ${position}`}
                        style={{ backgroundColor: toast.backgroundColor }}
                    >
                        <button onClick={() => deleteToast(toast.id)} >
                            <CloseWhiteicon />
                        </button>
                        <div className="toast_notification-image">
                            <img src={toast.icon} alt="" />
                        </div>
                        <div>
                            <p className="toast_notification-title">{toast.title}</p>
                            <p className="toast_notification-message"> {toast.description} </p>
                        </div>
                    </div>
                )
            }
        </div>
        </>
    )
}
export default Toast;