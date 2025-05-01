import checkIcon from './assets/check.svg';
import errorIcon from './assets/error.svg';
import infoIcon from './assets/info.svg';
import warningIcon from './assets/warning.svg';

export const TOAST_PROPERTIES = [
    {
        id: 0,
        title: 'LoginError',
        description: 'Error Occured! Check username=email and password.',
        backgroundColor: '#FF5277',
        icon: errorIcon,
        autoDelete: true,
        autoDeleteTime: 415
    },
    {
        id: 1,
        title: 'LoadError',
        description: 'Failed to Load the Messages',
        backgroundColor: '#FF5277',
        icon: errorIcon,
        autoDelete: true,
        autoDeleteTime: 415
    },
    {
        id: 2,
        title: 'ErrorCreateGroup',
        description: 'Error Occured! Failed to create group/user.',
        backgroundColor: '#FF5277',
        icon: errorIcon,
        autoDelete: true,
        autoDeleteTime: 415
    },
    {
        id: 3,
        title: 'ErrorSearchResults',
        description: 'Error Occured! Failed to Load the Search Results.',
        backgroundColor: '#FF5277',
        icon: errorIcon,
        autoDelete: true,
        autoDeleteTime: 415
    },
    {
        id: 4,
        title: 'Relogin',
        description: 'Failed to Load the Messages. Try to relogin.',
        backgroundColor: '#FF5277',
        icon: errorIcon,
        autoDelete: true,
        autoDeleteTime: 415
    },
    {
        id: 5,
        title: 'FailedLoadChats',
        description: 'Error Occured! Failed to Load the Chats.',
        backgroundColor: '#FF5277',
        icon: errorIcon,
        autoDelete: true,
        autoDeleteTime: 415
    },
    {
        id: 6,
        title: 'FailedLoadChat',
        description: 'Error fetching the chat. Request failed with status code 404',
        backgroundColor: '#FF5277',
        icon: errorIcon,
        autoDelete: true,
        autoDeleteTime: 415
    },

    {
        id: 7,
        title: 'PictureError',
        description: 'Error Occured! Failed to Load the picture',
        backgroundColor: '#FF5277',
        icon: errorIcon,
    },
    {
        id: 8,
        title: 'errorgroup',
        description: 'Error Occured! Failed to create/change/delete group',
        backgroundColor: '#FF5277',
        icon: errorIcon,
    },
    {
        id: 9,
        title: 'PictureAbsent',
        description: 'Picture is absent. Add a picture.',
        backgroundColor: '#F0AD4E',
        icon: warningIcon,
        autoDelete: true,
        autoDeleteTime: 415
    },
    {
        id: 10,
        title: 'Fields',
        description: 'Please fill all the feilds.',
        backgroundColor: '#F0AD4E',
        icon: warningIcon,
        autoDelete: true,
        autoDeleteTime: 415
    },
    {
        id: 11,
        title: 'AlreadyExists',
        description: 'This name is already is in DataBase. Choose another',
        backgroundColor: '#F0AD4E',
        icon: warningIcon,
        autoDelete: true,
        autoDeleteTime: 415
    },
    {
        id: 12,
        title: 'GroupTooSmall',
        description: 'Group contains at least 3 groupmember including you',
        backgroundColor: '#F0AD4E',
        icon: warningIcon,
        autoDelete: true,
        autoDeleteTime: 415
    },
    {
        id: 13,
        title: 'SearchAbsent',
        description: 'Search is absent. Please enter something in search.',
        backgroundColor: '#F0AD4E',
        icon: warningIcon,
        autoDelete: true,
        autoDeleteTime: 415
    },
    {
        id: 14,
        title: 'SetWrite',
        description: 'Set the switch to the position WRITE',
        backgroundColor: '#F0AD4E',
        icon: warningIcon,
        autoDelete: true,
        autoDeleteTime: 415
    },
    {
        id: 15,
        title: 'GroupChatCreated',
        description: 'New Group Chat Created!',
        backgroundColor: '#5bc0de',
        icon: checkIcon
    },
    {
        id: 16,
        title: 'NewUserCreated',
        description: 'New user created/added!',
        backgroundColor: '#5bc0de',
        icon: checkIcon
    },
    {
        id: 17,
        title: 'LoginSuccessfull',
        description: 'Login Successfull!',
        backgroundColor: '#5bc0de',
        icon: checkIcon
    },
    {
        id: 18,
        title: 'ChangeSuccess',
        description: 'This change was successfull!',
        backgroundColor: '#5bc0de',
        icon: checkIcon
    },
    {
        id: 19,
        title: 'UserAlreadyAdded',  //Юзери для додавання в нову групу
        description: 'The user is already in this group. Choose next one',
        backgroundColor: '#F0AD4E',
        icon: warningIcon
    },
    {
        id: 20,
        title: 'password',
        description: 'Password do not match',
        backgroundColor: '#F0AD4E',
        icon: warningIcon
    },
    {
        id: 21,
        title: 'email',
        description: 'Username should be an e-mail address',
        backgroundColor: '#F0AD4E',
        icon: warningIcon
    },
    {
        id: 22,
        title: 'onlyadmin',
        description: 'Only admin can add/remove/change someone!',
        backgroundColor: '#F0AD4E',
        icon: warningIcon
    },
    {
        id: 23,
        title: 'Info',
        description: 'This is an info toast component',
        backgroundColor: '#5bc0de',
        icon: infoIcon
    },
    {
        id: 24,
        title: 'DeleteSuccess',
        description: 'Message successfull deleted!',
        backgroundColor: '#5bc0de',
        icon: checkIcon
    },
    {
        id: 25,
        title: 'erroradduser',
        description: 'Error Occured! New user is not added',
        backgroundColor: '#FF5277',
        icon: errorIcon,
    },
    {
        id: 26,
        title: 'DeleteError',
        description: 'Error Occured!  Failed to delete the message.',
        backgroundColor: '#FF5277',
        icon: errorIcon,
        autoDelete: true,
        autoDeleteTime: 415
    },
];

export const BUTTON_PROPS = [
    {
        id: 1,
        type: 'success',
        className: 'success',
        label: 'Success'
    },
    {
        id: 2,
        type: 'danger',
        className: 'danger',
        label: 'Danger'
    },
    {
        id: 3,
        type: 'info',
        className: 'info',
        label: 'Info'
    },
    {
        id: 4,
        type: 'warning',
        className: 'warning',
        label: 'Warning'
    },
];