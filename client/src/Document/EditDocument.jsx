import React from 'react';
import { Component } from "react";
import {
  useParams
} from "react-router-dom";


class EditDocument extends Component
{
    constructor(props){
        super(props);
        this.state = {
          sessionId: undefined,
          id: props.match.params.id,
          textarea: {
            isHidden: true,
          },
          div: {
            isHidden: false,
            isContentEditable: true,
          },
          document: {
            title: undefined,
            content: undefined,
            state: undefined,
          },
        };
    }

    async componentDidMount(){
      //const cookieValue = document.cookie
       // .split('; ')
       // .find(row => row.startsWith('sessionId='));

      
        const requestBody = { docId : this.state.id };

        const doc = await fetch("/api/document", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify(requestBody),
        })
        .then(res => res.json());

        this.setState({document: { title: doc.title, content: doc.content, state: 'OK' }});
        console.log(doc);
        console.log(this.state);
    }

  render() {

    if (this.state.document.state !== 'OK')
    {
      return(<h1>Loading...</h1>);
    }

    return(
      <form className="documentForm">
        <h3 className="documentTitle">{this.state.document.title}</h3>
        <textarea hidden={this.state.textarea.isHidden}></textarea>
        <span className="div" spellCheck="false" hidden={this.state.div.isHidden} contentEditable="true"></span>
      </form>
    );
  }
  
}

export default EditDocument;
