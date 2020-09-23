import React, {Fragment, useContext} from 'react';
import ReactDOM from 'react-dom';
import Header from './src/app/layout/Header';
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
import Taps from './src/features/tap/Taps';
import TapTypes from './src/features/tapTypes/TapsTypes';
import ProjectSettingForm from './src/features/project/ProjectSettingForm';

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
                  <Route exact path='/' component={Dashboard} />
                  <Route
                     path={'/(.+)'}
                     render={() => (
                        <Switch>
                           <Route path="/projects" component={Authorization(Projects, [UserRoles.ADMIN, UserRoles.USER])}/>
                           <Route path="/project/create" component={Authorization(ProjectForm, [UserRoles.ADMIN])}/>
                           <Route path="/project/:id/settings/:settingId/edit" component={Authorization(ProjectSettingForm, [UserRoles.ADMIN])}/>
                           <Route path="/project/:id/settings/create" component={Authorization(ProjectSettingForm, [UserRoles.ADMIN])}/>
                           <Route path="/project/:id/settings" component={Authorization(ProjectSettings, [UserRoles.ADMIN])}/>
                           <Route path="/project/:id/create" component={Authorization(Floor, [UserRoles.ADMIN])}/>
                           <Route path="/project/:id" component={Authorization(Floor, [UserRoles.ADMIN, UserRoles.USER])}/>
                           <Route path="/project/:id/floors/:floorid" component={Authorization(Floor, [UserRoles.ADMIN, UserRoles.USER])}/>
                           <Route path="/teams" component={Authorization(Teams, [UserRoles.ADMIN])}/>
                           <Route path="/users" component={Authorization(Users, [UserRoles.ADMIN])}/>
                           <Route path="/taps" component={Authorization(TapTypes, [UserRoles.ADMIN])}/>
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
