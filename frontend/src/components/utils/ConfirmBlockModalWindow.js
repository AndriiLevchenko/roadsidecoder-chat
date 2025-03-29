import React from 'react'

const ConfirmBlockModalWindow = (props) => {
    return (
        <div className={props.classDialogName}>
            <div>{props.title}</div>
            <div className=''>
                <div>{props.query}</div>
                <div className='buttons_yes_no'>
                    <button className='button' onClick={props.onClickYes } >YES</button>
                    <button className='button'  onClick={props.onClickNo } >NO</button>
                </div>
            </div>
        </div>
    )
}
export default ConfirmBlockModalWindow
