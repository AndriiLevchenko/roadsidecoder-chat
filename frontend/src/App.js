
import './App.css';
import {Route} from "react-router-dom";
import Homepage from "./Pages/Homepage";
import ChatPage from "./Pages/ChatPage";
import { Link } from "react-router-dom";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";

function App() {
    const authUser = true;
  return (
    <div className="App">
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={ChatPage} />
        {/*<Route path='/login' component={Login} />*/}
        {/*<Route path='/signup' component={Signup} />*/}
    </div>
  );
}

export default App;
