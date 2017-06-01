import React, { Component } from 'react';
import axios from 'axios';

export default class Todo extends Component {

    constructor() {
        super();

        this.state = {
            todoList: [],
            newTodo: {
                content: '',
                finished: false
            }
        };
    }

    handleAddNewTodo() {
        let data = this.state.newTodo;
        axios({
            url: '/api/add_todo',
            method: 'post',
            data,
            contentType: 'application/json'
        })
        .then((res) => {
            if (res.data.meta.code == 200) {
                this.setState({
                    newTodo: {
                        content: '',
                        finished: false
                    },
                    todoList: [...this.state.todoList, data]
                })
            }
        })
    }

    handleTodoInput(e) {
        this.setState({
            newTodo: {
                content: e.target.value,
                finished: false
            }
        })
    }

    handleChangeStatus(index) {
        let { todoList } = this.state;
        axios({
            url: '/api/modify_todo_status',
            method: 'post',
            data: todoList[index],
            contentType: 'application/json'
        })
        .then((res) => {
            if (res.data.meta.code == 200) {
                todoList[index].finished = !todoList[index].finished;

                this.setState({
                    newTodo: {
                        content: '',
                        finished: false
                    },
                    todoList
                });
            }
        });
    }

    componentDidMount() {
        axios.get('/api/get_todo_list')
             .then((res) => {
                this.setState({
                    todoList: res.data
                });
             })
    }

    render() {

        const { newTodo, todoList } = this.state;
        return (
            <div>
                {
                    todoList.map((item, index) => {
                        return (
                            <p key={ index } style={{ textDecoration: item.finished === true ? 'line-through' : 'none'}} onClick={ this.handleChangeStatus.bind(this, index)}>{ item.content }</p>
                        )
                    })
                }
                <input type="text" value={ newTodo.content } onChange={ this.handleTodoInput.bind(this) }/>
                <button onClick={ this.handleAddNewTodo.bind(this) }>提交</button>
            </div>
        )
    }
}
