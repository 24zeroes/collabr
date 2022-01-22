import React from 'react';
import { Component } from "react";
import {
  diff_match_patch
} from "../../public/dmp.js";
import ContentEditable from 'react-contenteditable';

class EditDocument extends Component
{
    constructor(props){
        super(props);
        this.state = {
          diffMatchPatch: new diff_match_patch(),
          sessionId: undefined,
          id: props.match.params.id,
          textarea: {
            value: "",
          },
          shadowCopy:{
            content: undefined,
          },
          document: {
            title: undefined,
            state: undefined,
          },
          doneTypingTimer: undefined,
        };
        this.contentEditable = React.createRef();
        this.onChangeContent = this.onChangeContent.bind(this);
        this.updateDocument = this.updateDocument.bind(this);
        this.onKeyUpOnText = this.onKeyUpOnText.bind(this);
        this.onKeyDownOnText = this.onKeyDownOnText.bind(this);
    }

    onChangeContent(event){
      this.setState({textarea:{ value: event.target.value }});
    }

    async onKeyUpOnText(){
      clearTimeout(this.state.doneTypingTimer);
      this.state.doneTypingTimer = setTimeout(this.updateDocument, 1000);
    }
    
    onKeyDownOnText(){
      clearTimeout(this.state.doneTypingTimer);
    }

    async updateDocument(){
      console.log("Update document called");
      console.log("Shadow copy: " + this.state.shadowCopy.content);
      console.log("Client text: : " + this.state.textarea.value);
      let dmp = this.state.diffMatchPatch;
      let diff = dmp.diff_main(
        this.state.shadowCopy.content, 
        this.state.textarea.value, 
        true
      );
      
      if (diff.length > 2) {
        dmp.diff_cleanupSemantic(diff);
      }

      const patch_list = dmp.patch_make(
        this.state.shadowCopy.content,  
        this.state.textarea.value, 
        diff);

      this.setState({shadowCopy: {content: this.state.textarea.value}});
      
      const patch_text = dmp.patch_toText(patch_list);
      const requestBody = { patchText : patch_text, sessionId : this.state.sessionId, docId: this.state.id };

      console.log(requestBody);

      var data = await fetch("/api/document/save", 
      { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
      })
      .then(response => response.json());

      console.log("Patches from server :" + data.patches);
      const patches = dmp.patch_fromText(data.patches);
      console.log("Patches at first :" + patches);
      const shadowCopyResults = dmp.patch_apply(patches, this.state.shadowCopy.content);
      console.log("Patches after shadowCopyResults:" + patches);

      this.setState({shadowCopy: {content: shadowCopyResults[0]}});

      const clientText = this.state.textarea.value;
      const clientTextResults = dmp.patch_apply(patches, clientText);

      if (clientText !== clientTextResults[0])
      {
          this.setState({textarea: {value: clientTextResults[0]}});
      }
    }

    async componentDidMount(){
      await this.setSession();

      const requestBody = { docId : this.state.id, sessionId: this.state.sessionId };

      const doc = await fetch("/api/document", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body : JSON.stringify(requestBody),
      })
      .then(res => res.json());

      this.setState({
        textarea:{
          value: doc.text,
        },
        document: { 
          title: doc.title, 
          state: 'OK' },
        shadowCopy:{
          content: doc.text,
        }
      });
    }

    async setSession(){
      const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('sessionId='));

      let sessionId = undefined;
      if (cookieValue === null || cookieValue === undefined)
      {
        const session = await fetch("/api/session").then(res => res.json());
        sessionId = session.id;
        document.cookie = `sessionId=${sessionId}`;
        
      }
      else
      {
        sessionId = cookieValue.split('=')[1];
      }

      this.setState({sessionId: sessionId});
    }

  render() {

    if (this.state.document.state !== 'OK')
    {
      return(<h1>Loading...</h1>);
    }

    return(
      <div className="documentForm">
        <h3 className="documentTitle">{this.state.document.title}</h3>
        <ContentEditable 
          innerRef={this.contentEditable}
          className="documentContent" 
          html={this.state.textarea.value} 
          onChange={this.onChangeContent}  
          onKeyUp={this.onKeyUpOnText}
          onKeyDown={this.onKeyDownOnText}
        />
      </div>
    );
  }
  
}

export default EditDocument;
