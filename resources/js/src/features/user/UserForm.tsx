import React, { Component, Fragment } from 'react';
import { IRole } from '../../app/models/role.model';
import { ITeam } from '../../app/models/team.model';
import { IUser } from '../../app/models/user.model';
import { User } from '../../app/api/agent';
import { AxiosError } from 'axios';
import LoaderBar from '../../app/common/LoaderBar';


interface IProps {
    roles: IRole[];
    teams: ITeam[];
    afterAddNewUser: (team: IUser) => void;
}

interface IState {
    user: IUser;
    errors : IUser;
    added: boolean;
    showLoader: boolean;
}

class UserForm extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            user:{
                email:"",
                name: "",
                shortcode: "",
                password: "",
                role: {
                    role_name: "",
                },
                role_name:"",
                team_id:"",
            },
            errors:{
                email:"",
                name: "",
                shortcode: "",
                password: "",
                role: {
                    role_name: "",
                },
                role_name:"",
                team_id:"",
            },
            added: false,
            showLoader: false,
        }
    }

    nameChangeHandler(event: any) {
      let value :string  = event.target.value;
      let shortcode_arr = value.split(" "); 
      let shortcode = "";
      for(var i of shortcode_arr) {
          shortcode = shortcode + i.charAt(0).toUpperCase();
      }
      this.setState({user:{...this.state.user, name: event.target.value, shortcode:shortcode}});
    }

    onSubmitHandler(event: any) {
        event.preventDefault();
        this.setState({showLoader: true});
        User
        .saveUser(this.state.user)
        .then((res)=>{
            this.setState({
                errors: {...this.state.errors,
                            name: "",
                            email:"",
                            password:"",
                            shortcode:"",
                            team_id: "",
                            role_name:"",  
                        }
                });

                this.props.afterAddNewUser(res);

                this.setState({
                    user: {...this.state.user,
                                name: "",
                                email:"",
                                password:"",
                                shortcode:"",
                                team_id: "",
                                role_name:"",  
                            },
                            added: true,
                    });
                    this.setState({showLoader: false});
                    setTimeout(()=>{ this.setState({added: false})},2000);
                
        })
        .catch((error: AxiosError) => {
            if (error.response?.status == 422) {
                let error_array = error.response?.data.errors;
                this.setState({
                    errors: {...this.state.errors,
                                name:error_array?.name != undefined ? error_array?.name[0] : "",
                                email:error_array?.email != undefined ? error_array?.email[0] : "",
                                password: error_array?.password != undefined ? error_array?.password[0]: "",
                                shortcode: error_array?.shortcode != undefined ? error_array?.shortcode[0] : "",
                                team_id: error_array.team_id != undefined ? error_array.team_id[0] : "",
                                role_name: error_array.role_name != undefined ? error_array.role_name[0] : "",  
                            }
                    });
                    this.setState({showLoader: false}); 
            }
        });
       
    }
    
    render() {
        return (
            <Fragment>
 
                  <form onSubmit={this.onSubmitHandler.bind(this)}>
                    {this.state.showLoader?<LoaderBar></LoaderBar> : ""}
                    {this.state.added ? <div className="text-success">User Created Successfully.</div> : ""}
                           <div className="add-user-form d-flex align-items-end justify-content-between">                               
                              <div className="form-group col-md-5 px-1">
                                 <label>Add New User</label>
                                 <input type="name" 
                                        className={`form-control ${this.state.errors.name ? "is-invalid" : ""}`}
                                        placeholder="Name"
                                        value={this.state.user.name}
                                        onChange={this.nameChangeHandler.bind(this)}
                                        />
                                        {this.state.errors.name ? <span className="text-danger">{this.state.errors.name}</span>:""}
                              </div>
                           
                              <div className="form-group col-md-2 px-1">
                                 <input type="shortcode" 
                                        className={`form-control ${this.state.errors.shortcode ? "is-invalid" : ""}`}
                                        readOnly={true} 
                                        placeholder="Shortcode"
                                        value={this.state.user.shortcode}/>
                                 {this.state.errors.shortcode ? <span className="text-danger">{this.state.errors.shortcode}</span>:""}
                              </div>
                           
                              <div className="form-group col-md-5 px-1">
                                 <input type="email" 
                                        className={`form-control ${this.state.errors.email ? "is-invalid" : ""}`}
                                        placeholder="Email"
                                        value={this.state.user.email}
                                        onChange={(e) => this.setState({user:{...this.state.user, email: e.target.value}})}
                                        />
                                {this.state.errors.email ? <span className="text-danger">{this.state.errors.email}</span>:""}
                              </div>
                           </div>
                           <div className="row align-items-end justify-content-between px-3 align-items-center mt-5">
                              <div className="form-group col-md-7 px-1">
                                 <input type="password" 
                                        className={` form-control ${this.state.errors.password ? "is-invalid" : ""} `}
                                        placeholder="password"
                                        value={this.state.user.password}
                                        onChange={ (e) => this.setState({ user:{...this.state.user, password: e.target.value} }) }
                                        />
                                {this.state.errors.password ? <span className="text-danger">{this.state.errors.password}</span>:""}
                              </div>
                              <div className="form-group col-md-2 px-1">
                                 <select name="role" 
                                         className={`form-control ${this.state.errors.role_name ? "is-invalid" : ""}`}
                                         onChange={ (e) => this.setState({ user:{...this.state.user, role_name: e.target.value} }) }
                                         value={this.state.user.role_name}
                                         >
                                    <option value="">Select Role</option>
                                    {
                                        this.props
                                        .roles.map((role) => <option key={role.role_name} value={role.role_name}>{role.role_name}</option>)
                                    }
                                 </select>
                                 { this.state.errors.role_name ? <span className="text-danger">{this.state.errors.role_name}</span> : "" }
                              </div>
                           
                              <div className="form-group col-md-2 px-1">
                                 <select name="team" 
                                         className={`form-control ${this.state.errors.team_id ? "is-invalid" : ""}`} 
                                         value={this.state.user.team_id as string}                                        
                                         onChange={ (e) => this.setState({ user:{...this.state.user,team_id:e.target.value} }) }
                                         >
                                    <option value="">Select Team</option>
                                    {this.props
                                        .teams.map((team) => <option key={team.id} value={team.id}>{team.team_name}</option>)
                                    }
                                 </select>
                                  {this.state.errors.team_id ? <span className="text-danger">{this.state.errors.team_id}</span>:""}
                              </div>
                              <div className="form-btn form-group mb-4 col-md-1 px-1 text-right">
                                 <button type="submit" className="main-btn">Add</button>
                              </div>
                           </div>
                    </form>
            </Fragment>
        );
    }
}

export default UserForm;
