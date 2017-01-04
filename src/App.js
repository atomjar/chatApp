import React, { Component } from 'react';
import base from './config'
import './App.css';

class App extends Component {
  constructor () {
    super()
    this.state = {
      messages: [],
      userName: ''
    }
    this.auth = base.auth()
  }
  componentDidMount () {
    base.onAuth(this.authStateChanged.bind(this))
  }

  authStateChanged (user) {
    if (user) {
      this.setState({
        userName: user.displayName
      })
      this.sync = base.syncState('messages', {
        state: 'messages',
        context: this
      })
    } else {
      if (this.sync) {
        base.removeBinding(this.sync)
        delete this.sync
      }
      this.setState({
        messages: [],
        userName: '',
        asArray: true
      })
    }
  }

  signIn () {
    base.authWithOAuthPopup('google', this.authStateChanged.bind(this))
  }

  signOut () {
    base.unauth()
  }

  addMessage (){
    let text = this.input.value
    let newMessage = {text: text, name: this.state.userName}
    let newMessageArray = this.state.messages.concat(newMessage)
    this.setState({
      messages: newMessageArray
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2> Welcome to Chat {this.state.userName}</h2>
        </div>
        <button
          onClick={this.signIn.bind(this)}
          hidden={this.state.userName}
          >Sign in</button>
        <button
          onClick={this.signOut.bind(this)}
          hidden={!this.state.userName}
          >Sign Out</button>

        <div>{this.state.messages.map((message, index) => {
            return <p key={index}>{message.name}: {message.text}</p>
            })}
        </div>

        <div><h3>Add a message</h3>
          <input ref={input => this.input = input}/>
          <button onClick={this.addMessage.bind(this)}>Send</button>
        </div>
      </div>
    );
  }
}

export default App
