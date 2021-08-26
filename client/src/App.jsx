import React from 'react';
import { Component } from "react";
import { Link } from 'react-router-dom';


class App extends Component
{
  state = {
    docList: null,
  };

  componentDidMount(){
    fetch("/api/documents")
      .then(res => res.json())
      .then(docs => this.setState({docList: docs}));
  }

  render() {
    if (this.state.docList === null || this.state.docList === undefined)
    {
      return(<h1>Loading...</h1>);
    }

    return (
    <div>
      <h1>Document list:</h1>
      <ul>
        {this.state.docList.map((doc) => {
          return <li key={doc.contentid}><Link to={`/document/${doc.contentid}`} >{doc.name}</Link></li>
        })}
      </ul>
    </div>
    );
  }
  
}

export default App;
