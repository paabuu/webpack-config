import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    handleLoginInput(type, e) {
        this.setState({
            [type]: e.target.value
        })
    }

    handleLogin() {
        const { username, password } = this.state;

        if (!username || !password) return;

        axios({
            url: '/api/login',
            method: 'post',
            data: {
                username,
                password
            },
            contentType: 'application/json'
        })
        .then((res) => {

            if (res.data.meta.code === 200 ) {

                cookie.save('pabu_username', username);
                this.setState({
                    username: '',
                    password: ''
                });
                this.props.updateCollections();
                this.props.close();
            } else {
                alert('用户名不存在或密码错误!')
            }
        })
    }

    handleKeyDown(e) {

        if(e.keyCode === 13) {
            this.handleLogin();
        }
    }

    render() {
        const { username, password } = this.state;

        return (
            <div className="login" style={{ display: this.props.show === true ? 'flex' : 'none'}}>
                <div className="login-panel">
                    <div className="row">
                        <span className="username"></span>
                        <input type="text" value={ username } onKeyDown={ this.handleKeyDown.bind(this) } onChange={ this.handleLoginInput.bind(this, 'username')} />
                    </div>
                    <div className="row">
                        <span className="password"></span>
                        <input type="password" value={ password } onKeyDown={ this.handleKeyDown.bind(this) } onChange={ this.handleLoginInput.bind(this, 'password')} />
                    </div>
                    <a href="/regist" className="regist">sign up</a>
                </div>
            </div>
        )
    }
}
