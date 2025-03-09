import {ReactComponent as CloseIcon} from "./close.svg";

const Closeicon = ({setOpenProfileModal}) => {
    return (
        <div className='close_button' onClick={()=>setOpenProfileModal(false)}><CloseIcon className='icon chakra-icon' /></div>
    )
}
export default Closeicon
