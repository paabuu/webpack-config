import React, { Component } from 'react';
import axios from 'axios';

export default class Music extends Component {
    constructor() {
        super();
        this.state = {
            musicList: [],
            musicName: '',
            audio: null
        }
    }
    componentDidMount() {

    }

    handleInputSong(e) {
        this.setState({
            musicName: e.target.value
        })
    }

    searchMusic() {
        const self = this;
        this.setState({
            musicName: ''
        })
        axios({
            url: '/api/get_music_list',
            method: 'post',
            data: {
                name: self.state.musicName
            },
            contentType: 'application/json'
        })
        .then((res) => {
            console.log(res.data.data)
            this.setState({
                musicList: res.data.data.result.songs
            })
        })
    }

    handlePlayMusic(id) {
        axios({
            url: '/api/get_music_url',
            method: 'post',
            data: {
                id
            },
            contentType: 'application/json'
        })
        .then((res) => {
            const audio = new Audio(res.data.data.data[0].url);
            audio.play();
            this.setState({
                audio
            })
        })
    }
    render() {
        return (
            <div>
                <input type="text" placeholder="输入音乐名称" onChange={ this.handleInputSong.bind(this) } value={ this.state.musicName }/>
                <button onClick={ this.searchMusic.bind(this) }>搜索</button>
                {
                    this.state.musicList.map((item, index) => {
                        return (
                            <p key={ index } onClick={ this.handlePlayMusic.bind(this, item.id) }>{ item.name } <span>{ item.al.name }</span></p>
                        )
                    })
                }
            </div>
        )
    }
}
