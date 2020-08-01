import React, {Component} from 'react';
import 'antd/dist/antd.css';
import '../../styles/Login/Login.css';
import { Button } from 'antd';
import {TOKEN_KEY, API_ROOT} from "../../constants";
class Login extends Component {

    state = {
        isAuth: true,
        show: false,
        test: ''
    };

    /**
     * on login btn clicked send login request
     * @method onLogin
     * @for Login
     * @param none
     * @return null
     */
    onLogin = () => {
        let userinfo = JSON.parse(localStorage.getItem(TOKEN_KEY));
        this.props.handleLogin(userinfo);
    };

    /**
     * on auth btn clicked set Login state
     * @method onAuth
     * @for Login
     * @param none
     * @return null
     */
    onAuth = async () => {
        this.setState({isAuth: false, show: true});
        this.getToken()

    };

    testFunc = (e) => {
        try {
            JSON.parse(e.data)
            localStorage.setItem(TOKEN_KEY, e.data);
            this.onLogin();
        }
        catch (e) {
            console.log(e)
        }

    };

    getToken = () => {
        window.open(`${API_ROOT}/login/secure/aad`, 'newwindow', 'height=500, width=500, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
        window.addEventListener('message', this.testFunc, false)
    };

    render() {
        return (
            <div className={"backgroundImg"}>

                <Button type={"primary"} className={"login-btn"} onClick={this.onAuth}>Login</Button>

            </div>
        );
    }
}

export default Login;