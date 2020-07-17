import React, {Fragment, useContext} from 'react';
import ReactDOM from 'react-dom';
import {Header} from './src/app/layout/Header';
import {Dashboard} from './src/features/dashboard/Dashboard';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Teams from './src/features/team/Teams';
import BottomHeader from './src/app/layout/BottomHeader';
import Projects from './src/features/project/Projects';
import Users from './src/features/user/Users';
import { TitleContext } from './src/context/TitleContext';
import Authorization from './src/app/hoc/Authorization';
import { UserContext, userObject } from './src/context/UserContext';
import { UserRoles } from './src/app/models/role.model';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import ProjectSettings from './src/features/project/ProjectSettings';
import Floor from './src/features/floor/Floor';
import ProjectForm from './src/features/project/ProjectForm';

interface IProps {}

interface IState {
   title:string | null;
}

export default class App extends React.Component<IProps, IState>{
   constructor(props: any) {
      super(props);
      this.state = {
         title: null,
      }
   }

   changeTitle = (title: string | null) => {
      this.setState({title: title});
   }
   
  render(): any{
     return(
         <Fragment>
            <Provider store={store}>              
            <BrowserRouter> 
               <UserContext.Provider value={userObject}>
                  <Header/>     
               </UserContext.Provider>  
               <TitleContext.Provider value={{ title:this.state.title as string, changeTitle: this.changeTitle}}>
                     <BottomHeader/>   
                  </TitleContext.Provider>
                  {/* <Route exact path='/' component={Dashboard} />  */}
                  <Route
                     path={'/(.+)'}
                     render={() => ( 
                     
                        <Switch>  
                           <Route exact path="/" component={Authorization(Dashboard, [UserRoles.ADMIN])}/>
                           <Route exact path="/projects" component={Authorization(Projects, [UserRoles.ADMIN, UserRoles.USER])}/>
                           <Route exact path="/project/create" component={Authorization(ProjectForm, [UserRoles.ADMIN])}/>
                           <Route exact path="/project/:id/settings" component={Authorization(ProjectSettings, [UserRoles.ADMIN])}/>
                           <Route exact path="/project/:id" component={Authorization(Floor, [UserRoles.ADMIN, UserRoles.USER])}/>
                           <Route exact path="/project/:id/floors/:floorid" component={Authorization(Floor, [UserRoles.ADMIN, UserRoles.USER])}/>
                           <Route exact path="/teams" component={Authorization(Teams, [UserRoles.ADMIN])}/>
                           <Route exact path="/users" component={Authorization(Users, [UserRoles.ADMIN])}/>
                        </Switch>
                     )}
                  />    
               </BrowserRouter>
            </Provider>
         </Fragment>
     );
  }
}
ReactDOM.render(<App/>,document.getElementById('root'));
