import React, { Component } from 'react';
import { render } from 'react-dom';
import Header from './Header';
import {Router, Switch} from 'react-router-dom';
export class App extends Component {
    render(): any{
        return(
            <div>
                <Header/>            
            </div>
        );
    }
}

export default App;
