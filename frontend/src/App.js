
import './App.css';
import {Route} from "react-router-dom";
import Homepage from "./Pages/Homepage";
import ChatPage from "./Pages/ChatPage";
import { Link } from "react-router-dom";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import Toast from "./utils/Toast/Toast";
// import {list} from "./utils/Toast/List";
import {TOAST_PROPERTIES} from "./utils/Toast/toastProperties";
import {ChatState} from "./Context/ChatProvider";
// import {ToastContainer} from "react-toastify";

function App() {
    const authUser = true;
    const {list}  = ChatState();
  return (
    <div className="App">
        {/*<ToastContainer />*/}
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={ChatPage} />
        {/*<Route path='/login' component={Login} />*/}
        {/*<Route path='/signup' component={Signup} />*/}
        <Toast  toastList={list}
               position="top-right"  autoDelete = {true} autoDeleteTime={133235} />
    </div>
  );
}

export default App;
