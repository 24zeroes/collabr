import React from 'react';
import { Component } from "react";
import { Redirect } from 'react-router-dom';

class CreateDocument extends Component {
  constructor(props){
    super(props);
    this.state = {
      documentName: '',
      isControlsDisabled: false,
      documentIdToRedirect: null,
      isRedirectToCreatedDoc: false,
    };

    this.onCreateButtonClick = this.onCreateButtonClick.bind(this);
    this.onDocumentNameChange = this.onDocumentNameChange.bind(this);
  }

  onDocumentNameChange(event){
    this.setState({documentName: event.target.value})
  }

  onCreateButtonClick(){
    this.setState({isControlsDisabled: true});
    const requestBody = { name: this.state.documentName};
    fetch("/api/document/create", 
    { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    })
    .then(res => res.json())
    .then(doc => this.setState({documentIdToRedirect: doc.id, isRedirectToCreatedDoc: true}))
    .catch(function(ex) {
      console.log("Error fetching /api/document/create\n" + ex);
    })
    .then(() => this.setState({isControlsDisabled: false}));
  }

  render() {
    const isControlsDisabled = this.state.isControlsDisabled;
    const newDocId = this.state.documentIdToRedirect;
    if (this.state.isRedirectToCreatedDoc === true)
    {
      return (<Redirect to={`/document/${newDocId}`} />);
    }
    return (
      <div>
        <h2>New document name:</h2>
        <input type="text" value={this.state.value} onChange={this.onDocumentNameChange} disabled={isControlsDisabled}></input>
        <button onClick={this.onCreateButtonClick} disabled={isControlsDisabled}>Create</button>
      </div>
    );
  }
}

export default CreateDocument;