import React from 'react';
import { Component } from "react";

class CreateDocument extends Component {
  constructor(props){
    super(props);
    this.state = {
      isControlsDisabled: false,
      documentIdToRedirect: null,
      isRedirectToCreatedDoc: false,
    };

    this.onCreateButtonClick = this.onCreateButtonClick.bind(this);
  }

  onCreateButtonClick(){
    this.setState({isControlsDisabled: true});
    fetch("/api/document/create", 
    { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
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
        <input disabled={isControlsDisabled}></input>
        <button onClick={this.onCreateButtonClick} disabled={isControlsDisabled}>Create</button>
      </div>
    );
  }
}

export default CreateDocument;