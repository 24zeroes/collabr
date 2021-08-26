import React from 'react';
import { Component } from "react";
import {
  useParams
} from "react-router-dom";


class Document extends Component
{
  render() {
    return(<h2>Doc with id {<DocId />}</h2>);
  }
  
}

function DocId() {
  let parameters = useParams();
  return <span>{parameters.id}</span>
    
}

export default Document;
