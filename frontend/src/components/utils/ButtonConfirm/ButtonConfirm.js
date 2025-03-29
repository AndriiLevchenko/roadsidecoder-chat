import React from "react";
import ConfirmBlockModalWindow from "../ConfirmBlockModalWindow";

class ButtonConfirm extends React.Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            title: this.props.title,
            classButtonName: 'buttonForm buttonAlert button ',
            classDialogName: ' modal_section',
            query: this.props.query,
            param: "del",
            param_id: "-1",
            view: "button"
        }

    }

    showDialog()
    {
        this.setState({
            view: "query"
        });

    }

    onClickYes()
    {
        alert("Yes we delete this.state.param_id = " + this.state.param_id + " this.state.param = " + this.state.param);
        this.setState({
            view: "button"
        });

        this.props.onConfirm("yes",this.state.param, this.state.param_id);

    }

    onClickNo()
    {
        alert(" No we delete this.state.param_id = " + this.state.param_id + " this.state.param = " + this.state.param);
        this.setState({
            view: "button"
        });

        this.props.onConfirm("no",this.state.param, this.state.param_id);
    }

    render()
    {
        if(this.state.view == "button")
        {
            return (
                <div className={this.state.classButtonName} onClick={this.showDialog.bind(this) }>{this.state.title}</div>
            );
        }

        if(this.state.view == "query")
        {
            console.log("query = ", this.props.query);
            return (
                <ConfirmBlockModalWindow classDialogName={this.state.classDialogName} title={this.state.title} query={this.props.query} classButtonName={this.state.classButtonName} onClickYes={this.onClickYes.bind(this) } onClickNo={this.onClickNo.bind(this) } />
            );
        }
    }
}

export default ButtonConfirm;