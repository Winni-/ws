import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { w3cwebsocket as WS } from 'websocket';

class App extends Component {
	
	state = {
		wsOpen: false,
		msg: 'Соединяемся'
	};
	
	createWS = ( token ) =>{
		return new WS(`ws://api.staging.iqlang.local?accessToken=${token}&clientID=123`, 'iqlang-app', null);
	};
	
	connect = token =>{
		try {
			this.socket = this.createWS(token);
			this.socket.onopen = function( openEvent ){
				this.setState({
					wsOpen: true,
					msg: 'Соединение установленно'
				})
			};
		} catch(exception) {
			this.setState({msg: `Нет соединения, 404 или еще что - ${exception}`})
		}
		this.socket.onerror = ( errorEvent ) =>{
			this.setState({
				msg: 'Ошибка'
			})
		};
		
		this.socket.onclose = ( closeEvent ) =>{
			this.setState({
				wsOpen: false,
				msg: 'Сокет закрыт'
			})
		};
		this.socket.onmessage = ( messageEvent ) =>{
			
			if ( !messageEvent.data instanceof Blob ) {
				this.setState({msg: messageEvent.data})
			}
			
		};
	};
	sendPing = () =>{
		this.socket.send('ping');
	};
	startPinging = () =>{
		if (this.state.wsOpen === true) this.pingInterval = setInterval(this.sendPing, 1000);
		
	};
	
	stopPinging = () =>{
		clearInterval(this.pingInterval)
	};
	
	componentDidMount(){
		const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImNsaWVudElkIjoiNWNjNDgwOWM4MmI4NGFmY2RlNDM3YzZmNWZiOTkyMDYiLCJyb2xlIjoic3R1ZGVudCIsInVzZXJJZCI6MX0sInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE1MTQyOTA4NTQsImV4cCI6MTUxNDYzNjQ1NH0.9VrHdokzlGgSjlWtVjX4qMsQd1FLK000kPLcv8PJnBI';
		//connect
		this.connect(token);
	}
	
	
	render(){
		return (
			<div className="App">
				<header className="App-header">
					<img src={ logo } className="App-logo" alt="logo"/>
					<h1 className="App-title">{ this.state.msg }</h1>
				</header>
				<p className="App-intro">
					<button onClick={ this.startPinging }>Пинговать</button>
					<button onClick={ this.stopPinging }>Не пинговать</button>
				</p>
			</div>
		);
	}
}

export default App;
