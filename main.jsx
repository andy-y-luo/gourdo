import React from 'react';
import ReactDOM from 'react-dom';
import { ButtonToolbar }  from 'react-bootstrap';
import {SplitButton } from 'react-bootstrap';
import {MenuItem } from 'react-bootstrap';

var socket = new WebSocket("ws://localhost:8081");




class Doc extends React.Component {

  constructor(props) {
    super(props)
    this.state = {Data: 0}
  }

  componentWillMount() {

    socket.onmessage = (event) => {
      this.setState(JSON.parse(event.data))
    }
  }

  render() {
    return  <div>
                <h1 id="header">Welcome to Gourdo</h1>
                <h1>You are {this.state.Data/100} m away from an object</h1>
                <div id="Buttons">
                  <SplitButton title="Button 1" id="dp1" bsStyle='bs1'>
                    <MenuItem eventKey="1">Cross the Street</MenuItem>
                    <MenuItem eventKey="2">Share Location</MenuItem>
                    <MenuItem eventKey="3">Trigger Voice Assitant</MenuItem>
                  </SplitButton>
                  <SplitButton title="Button 2" id="dp2" bsStyle='bs1'>
                    <MenuItem eventKey="1">Cross the Street</MenuItem>
                    <MenuItem eventKey="2">Share Location</MenuItem>
                    <MenuItem eventKey="3">Trigger Voice Assitant</MenuItem>
                  </SplitButton>
                  <SplitButton title="Button 3" id="dp3" bsStyle='bs1'>
                    <MenuItem eventKey="1">Cross the Street</MenuItem>
                    <MenuItem eventKey="2">Share Location</MenuItem>
                    <MenuItem eventKey="3">Trigger Voice Assitant</MenuItem>
                  </SplitButton>
                </div>

            </div>

  }
}

ReactDOM.render(<Doc/>, document.getElementById('contents'));
