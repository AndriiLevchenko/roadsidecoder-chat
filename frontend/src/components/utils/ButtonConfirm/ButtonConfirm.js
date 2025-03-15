import React from "react";

class ButtonConfirm extends React.Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            title: this.props.title,
            classButtonName: 'buttonForm buttonAlert  button signup_button enter_button',
            classDialogName: 'dialog_alert modal_section',
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
        this.setState({
            view: "button"
        });

        this.props.onConfirm("yes",this.state.param, this.state.param_id);
    }

    onClickNo()
    {
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
                <div className={this.state.classDialogName}>
                    <div>{this.state.title}</div>
                    <div className=''>
                        <div>{this.props.query}</div>
                        <div className='buttons_yes_no'>
                            <button className={this.state.classButtonName} onClick={this.onClickYes.bind(this) } >YES</button>
                            <button className={this.state.classButtonName} onClick={this.onClickNo.bind(this) } >NO</button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default ButtonConfirm;