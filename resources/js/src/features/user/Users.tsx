import React, { Component } from 'react';
import { Role, Team, User} from '../../app/api/agent';
import { IRole } from '../../app/models/role.model';
import { IUser } from '../../app/models/user.model';
import { ITeam } from '../../app/models/team.model';
import UserListItem from './UserListItem';
import UserForm from './UserForm';
import LoaderBar from '../../app/common/LoaderBar';

interface IProps{}

interface IState {
   roles: IRole[];
   teams: ITeam[];
   users: IUser[];
   elements: IUser[];
   searchInput: string;
   showLoader:boolean;
}

class Users extends Component<IProps, IState> {
   constructor(props: IProps) {
      super(props);
      this.state = {
         roles: [],
         teams: [],
         users: [],
         elements: [],
         searchInput: "",
         showLoader: false,
      }
   }
   
   componentDidMount() {
      
      this.setState({showLoader: true});

      Role
      .getRoles()
      .then((res) => this.setState({roles: res}));

      Team
      .getTeams()
      .then((res) => this.setState({teams: res}));

      User
      .getUsers()
      .then((res) => this.setState({
                                       users: res, 
                                       elements: res, 
                                       showLoader:false
                                    })
      ).catch((res) => this.setState({showLoader: false}) );
   }

   filterListItems = (event :any) => {
      let search = this.state.searchInput;
      if (search != "") {
          let elem = this.state.users.filter(e => e.name.includes(search));
          this.setState({elements: elem});
      } else {
          this.setState({elements:this.state.users});
      }
     
  }
  afterAddNewUser(user: IUser) {
   this.setState({
      elements:[...this.state.users, user]
  })
  }

    render() {
        return (
            <div>
               <div className="add-new-user">
                  <div className="container">
                     <div className="main-team-area">
                        <UserForm roles={this.state.roles} 
                                  teams={this.state.teams}
                                  afterAddNewUser={this.afterAddNewUser.bind(this)}/>
                        <div className="team-search mt-5 px-4 ml-3">
                           <div className="row align-items-center justify-content-between ">
                              <div className="add-new-team">
                                 <h5 className="font-weight-normal">User</h5>
                              </div>
                              <div className="team-form-btn">
                                 <form className="form-inline my-2 my-lg-0">
                                    <input   className="form-control" 
                                             type="search" 
                                             placeholder="Search..." 
                                             onChange={(e) => this.setState({searchInput: e.target.value})}
                                             aria-label="Search"/>
                                    <button className="btn s my-2 my-sm-0" 
                                             type="button"
                                             onClick={this.filterListItems.bind(this)}
                                    ><i className="fa fa-search" aria-hidden="true"></i></button>
                                 </form>
                              </div>
                           </div>
                        </div>
                        { 
                           this.state.showLoader ? <LoaderBar/> : 
                           <div className="team-name-box">
                           <div className="main-table table-responsive">
                              <table className="table">
                                 <thead>
                                    <tr>
                                       <th scope="col" className="text-left">Name</th>
                                       <th scope="col">Shortcode</th>
                                       <th scope="col">Role</th>
                                       <th scope="col">Team</th>
                                       <th scope="col"></th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                         {this.state.elements
                                         .map((user) => <UserListItem 
                                                            key={user.id}
                                                            roles={this.state.roles}
                                                            teams={this.state.teams}
                                                            user={user}/>
                                         )}    
                                 </tbody>
                              </table>
                           </div>
                           </div>
                        }                        
                     </div>
                  </div>
               </div>
            </div>
        );
    }
}

export default Users;
