import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react'

interface AppProps {
  enterPin: boolean
}

export default class App extends Component<{},AppProps> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.setState({
      enterPin: false
    });
    this.enablePinTextBox = this.enablePinTextBox.bind(this);
    this.finishAuthentication = this.finishAuthentication.bind(this);
  }

  render() {
    return (
      <div className="m-2">
        <div>
          <a className="btn btn-primary" 
            href="https://anilist.co/api/v2/oauth/authorize?client_id=2979&response_type=token" 
            target="_blank"
            onClick={this.enablePinTextBox}>
            Login
          </a>
        </div>
        <div className="mt-2">
          { this.state && this.state.enterPin ? 
              <textarea className="form-control"
                onPaste={this.finishAuthentication}/> : 
              null }
        </div>
      </div>)
  }

  enablePinTextBox() {
    this.setState({
      enterPin: true
    });
  }

  finishAuthentication(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const text = e.clipboardData.getData("text");
    
  }
}
