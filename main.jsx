import React from 'react';
import ReactDOM from 'react-dom';

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
    return <h1>{this.state.Data}</h1>
  }
}

ReactDOM.render(<Doc/>, document.getElementById('contents'));
