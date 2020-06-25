import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {Header} from './src/app/layout/Header';
import {Dashboard} from './src/features/dashboard/Dashboard';
import { Router, Route, BrowserRouter, Switch } from 'react-router-dom';
import Teams from './src/features/team/Teams';
import BottomHeader from './src/app/layout/BottomHeader';
import Projects from './src/features/project/Projects';
import Users from './src/features/user/Users';

export default class App extends React.Component{
  render(): any{
   
     return(
         <Fragment>
            <BrowserRouter>   
               <Header/>      
               <BottomHeader/>    
               {/* <Route exact path='/' component={Dashboard} />  */}
               <Route
                  path={'/(.+)'}
                  render={() => ( 
                    
                     <Switch>  
                        <Route exact path="/" component={Dashboard}/>
                        <Route exact path="/projects" component={Projects}/>
                        <Route exact path="/teams" component={Teams}/>
                        <Route exact path="/users" component={Users}/>
                     </Switch>
                  )}
               />
                     
            </BrowserRouter>
         </Fragment>
     );
  }
}

ReactDOM.render(<App/>,document.getElementById('root'));