import React from 'react';
import ReactDOM from 'react-dom';
import { ButtonToolbar }  from 'react-bootstrap';
import {SplitButton } from 'react-bootstrap';
import {MenuItem } from 'react-bootstrap';

var socket = new WebSocket("ws://localhost:8081");
var button = 0;


class Doc extends React.Component {

  constructor(props) {
    super(props)
    this.state = {Data: 0, statement:""}

  }

  componentWillMount() {

    socket.onmessage = (event) => {
      this.setState(JSON.parse(event.data))
    }
  }

buttonSelect(eventKey){
  if(eventKey == 1){
    console.log(button)
    console.log("Button 1 Set to Cross the Street")
    this.setState({statement:"Button "+button+" Set to Cross the Street"})
  }
  if(eventKey == 2){
    console.log(button)
    console.log("Button 2 Set to Share Location")
    this.setState({statement:"Button "+button+" Set to Share Location"})
   }
  if(eventKey == 3){
    console.log(button)
    console.log("Button 3 Set to Trigger Voice Assitant")
    this.setState({statement: "Button "+button+ " Set to Trigger Voice Assitant"})
  }
}

b1(){
  button = 1
}
b2(){
  button = 2
}
b3(){
  button = 3
}
  render() {
    return  <div>
                <h1 id="header">Welcome to Gourdo</h1>
                <h1>You are {this.state.Data/100} m away from an object</h1>
                <div id="Buttons">
                  <SplitButton title="Button 1" id="dp1"  onSelect={(eventKey)=>this.buttonSelect(eventKey)}>
                    <MenuItem eventKey="1" onClick={()=>this.b1()}>Cross the Street</MenuItem>
                    <MenuItem eventKey="2" onClick={()=>this.b1()}>Share Location</MenuItem>
                    <MenuItem eventKey="3" onClick={()=>this.b1()}>Trigger Voice Assitant</MenuItem>
                  </SplitButton>
                  <SplitButton title="Button 2" id="dp2"  onSelect={(eventKey)=>this.buttonSelect(eventKey)}>
                    <MenuItem eventKey="1" onClick = {()=>this.b2()}>Cross the Street</MenuItem>
                    <MenuItem eventKey="2" onClick = {()=>this.b2()}>Share Location</MenuItem>
                    <MenuItem eventKey="3" onClick = {()=>this.b2()}>Trigger Voice Assitant</MenuItem>
                  </SplitButton>
                  <SplitButton title="Button 3" id="dp3" onSelect={(eventKey)=>this.buttonSelect(eventKey)}>
                    <MenuItem eventKey="1" onClick = {()=>this.b3()}>Cross the Street</MenuItem>
                    <MenuItem eventKey="2" onClick = {()=>this.b3()}>Share Location</MenuItem>
                    <MenuItem eventKey="3" onClick = {()=>this.b3()}>Trigger Voice Assitant</MenuItem>
                  </SplitButton>
                </div>
                <h1>{this.state.statement}</h1>

            </div>

  }
}

ReactDOM.render(<Doc/>, document.getElementById('contents'));
