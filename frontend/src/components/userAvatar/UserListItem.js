import { ChatState } from "../../Context/ChatProvider";

//Це список який видає пошук при створенні групи
const UserListItem = ({ handleFunction, user }) => {
    //const { user } = ChatState();

    return (
        <div onClick={handleFunction} className='modal-listItem'>
            <span className='span_avatar'>
                <img className='imgAvatar' alt='Avatar' src={user.pic} />
            </span>
            <div className='modal_listItem-data'>
                <p><b>Name: </b> {user.name} </p>
                <p><b>Email: </b> {user.email} </p>
            </div>
        </div>
    );
};

export default UserListItem;
