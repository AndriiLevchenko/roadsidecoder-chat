import React from "react";
import ConfirmBlockModalWindow from "../ConfirmBlockModalWindow";
import {ChatState} from "../../../Context/ChatProvider";

const ButtonConfirmNew =(props)=> {
    const { modal, setModal } = ChatState();
    console.log(" props in ButtonConfirmNew  = ", props);

    const showDialog=()=> {
        //const viewNew = "query"
        setModal({ ...modal, view: "query"});
    }
    const onClickYes=()=> {
        alert("YES !!!");
        console.log("Yes props = ", props);
        props.onConfirm();
        setModal({ ...modal, view: "button"});
    }
    const onClickNo=()=> {
        setModal({ ...modal, view: "button"});
        //props.onConfirm("no", modal.param, modal.param_id);
    }

        if(modal.view == "button")
        {
            console.log("query = ", props.query);
            console.log(" modal Button = ",  modal);
            return (
                <div className={modal.classButtonName} onClick={()=>showDialog() }>{props.title}</div>
            );
        }

        if(modal.view == "query")
        {
            console.log("query = ", props.query);
            console.log(" modal Query = ",  modal);
            return (
                <ConfirmBlockModalWindow classDialogName={modal.classDialogName} title={props.title} query={props.query} classButtonName={modal.classButtonName} onClickYes={()=>onClickYes() } onClickNo={()=>onClickNo() } />
            );
        }

}

export default ButtonConfirmNew;