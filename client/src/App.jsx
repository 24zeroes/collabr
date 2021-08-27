import React from 'react';
import { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

class App extends Component
{
  constructor(props){
    super(props);
    this.state = {
      docList: null,
      redirectToNewDoc: false,
    };
  };

  componentDidMount(){
    fetch("/api/documents")
      .then(res => res.json())
      .then(docs => this.setState({docList: docs}));
  }

  onCreateDocumentClick(){
    this.setState({redirectToNewDoc: true});
  }

  render() {
    if (this.state.redirectToNewDoc === true)
    {
      return (<Redirect to="/document/create" />);
    }

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
      <Link to={"/document/create"}>Create new document</Link>
    </div>
    );
  }
  
}

export default App;
