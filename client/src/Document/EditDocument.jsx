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

        this.setState({document: { title: doc.name, content: doc.content, state: 'OK' }});
    }

  render() {

    if (this.state.document.state !== 'OK')
    {
      return(<h1>Loading...</h1>);
    }

    return(<h2>Edit document with id {this.state.id}</h2>);
  }
  
}

export default EditDocument;
