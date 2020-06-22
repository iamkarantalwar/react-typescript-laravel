import React from 'react';
import ReactDOM from 'react-dom';
import Header from '../shared/components/Header/Header';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ViewProjects from './Projects/ViewProjects';
import AddProject from './Projects/AddProject';
import Projects from './Projects/Projects';

function App() {
    return (
        <div>
        <p>Hello world</p>
      
        </div>
    );
}

export default App;

ReactDOM.render(    
    <Router> 
        <Header/>          
        <Switch>        
            <Route exact path="/" component={App}/>
            <Route exact path="/projects" component={Projects}/>
            <Route exact path="/project/create" component={AddProject}/>
        </Switch>
    </Router>
    
    , document.getElementById('app'));

