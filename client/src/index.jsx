import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import App from './App.jsx';
import Document from './Document/Document.jsx';
import CreateDocument from './Document/CreateDocument.jsx';
import EditDocument from './Document/EditDocument.jsx';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route path="/document/:id/edit" component={EditDocument} />
            <Route path="/document/create" children={<CreateDocument />}/>
            <Route path="/document/:id" children={<Document />}/>
            <Route path="/">
                <App />
            </Route>
        </Switch>
    </BrowserRouter>,
    document.getElementById('root'),
);