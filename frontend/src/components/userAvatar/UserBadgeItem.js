import Closeicon from "../../images/Closeicon";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
    return (
        <div
            className='badgeItem'
            onClick={handleFunction}
        >
            <span>{user.name}
                {admin === user._id && <span> (Admin)</span>}</span>
            <Closeicon />
        </div>
    );
};

export default UserBadgeItem;
//equal