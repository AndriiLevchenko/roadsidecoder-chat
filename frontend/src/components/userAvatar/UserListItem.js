import { ChatState } from "../../Context/ChatProvider";

//Це список який видає пошук при створенні групи
const UserListItem = ({ handleFunction }) => {
    const { user } = ChatState();

    return (
        <div onClick={handleFunction} className='modalListItem'>
            <span className='spanAvatar'>
                <img className='imgAvatar' alt='Avatar' src={user.pic} />
                <span>name={user.name}</span>
            </span>
            <div className='modalListItem-data'>
                <p>{user.name}</p>
                <p>
                    <b>Email : </b>
                    {user.email}
                </p>
            </div>
        </div>
    );
};

export default UserListItem;
