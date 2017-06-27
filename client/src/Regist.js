import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';

export default class Regist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password1: '',
            password2: ''
        }
    }

    handleLoginInput(type, e) {
        this.setState({
            [type]: e.target.value
        })
    }

    handleLogin() {
        const { username, password1, password2 } = this.state;

        if (!username || !password1 || !password2) return;

        if (password1 !== password2) {
            alert('密码两次输入不一致！');
            return;
        }

        axios({
            url: '/api/regist',
            method: 'post',
            data: {
                username,
                password: password1
            },
            contentType: 'application/json'
        })
        .then((res) => {
            if (res.data.meta.code === 200) {
                this.setState({
                    username: '',
                    password1: '',
                    password2: ''
                });
                cookie.save('pabu_username', username);
                location.href = '/music'
            } else {
                alert('用户名已存在!')
            }
        })
    }

    handleKeyDown(e) {

        if(e.keyCode === 13) {
            this.handleLogin();
        }
    }

    render() {
        const { username, password1, password2 } = this.state;

        return (
            <div className="login">
                <div className="login-panel">
                    <div className="row">
                        <span className="username"></span>
                        <input type="text" value={ username } onKeyDown={ this.handleKeyDown.bind(this) } onChange={ this.handleLoginInput.bind(this, 'username') } placeholder="用户名" />
                    </div>
                    <div className="row">
                        <span className="password"></span>
                        <input type="password" value={ password1 } onKeyDown={ this.handleKeyDown.bind(this) } onChange={ this.handleLoginInput.bind(this, 'password1') } placeholder="密码" />
                    </div>
                    <div className="row">
                        <span className="password"></span>
                        <input type="password" value={ password2 } onKeyDown={ this.handleKeyDown.bind(this) } onChange={ this.handleLoginInput.bind(this, 'password2') } placeholder="确认密码" />
                    </div>
                    <button>注册</button>
                </div>
            </div>
        )
    }
}
