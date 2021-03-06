import React, { Component, Fragment } from 'react';
import { IUser } from '../../app/models/user.model';
import { ITeam } from '../../app/models/team.model';
import { IRole } from '../../app/models/role.model';
import { User } from '../../app/api/agent';
import LoaderBar from '../../app/common/LoaderBar';
import { withTranslation, WithTranslation } from 'react-i18next';

interface IProps extends WithTranslation {
    user: IUser;
    roles: IRole[];
    teams: ITeam[];
}

interface IState {
    user: IUser,
    errors: {
        name: string,
        role: string,
        team: string,
        shortcode: string,
    },
    updated: boolean,
    showLoader: boolean,
    pencil: boolean,
}

class UserListItem extends Component<IProps, IState> {
    constructor(props:  IProps) {
        super(props);
        this.state = {
            user:this.props.user,
            errors: {
                name: "",
                role: "",
                team: "",
                shortcode: "",
            },
            updated: false,
            showLoader:false,
            pencil: true,

        }
    }
    componentDidMount() {
        this.setState({user: {...this.state.user,role_name: this.props.user.role.role_name}})
    }
    updateUserDetails(event: any) {
       if(this.state.pencil) {
           this.setState({pencil:false});
           return;
       }

        this.setState({showLoader: true});
        User
        .updateUser(this.state.user)
        .then((res)=>{
            this.setState({
                errors: {...this.state.errors,
                            name: "",
                            shortcode: "",
                            team: "",
                            role: "",
                        }
                });

                this.setState({updated: true, showLoader: false, pencil: true});
                setTimeout(()=>{ this.setState({updated: false})},1000);
                // this.setState({});
                // this.setState({user: {...this.state.user,role_name: res.role.role_name}})

        })
        .catch((error) =>{
            this.setState({updated: false});
            if (error.response?.status == 422) {
                let error_array = error.response?.data.errors;
                this.setState({
                    errors: {...this.state.errors,
                                name:error_array?.name != undefined ? error_array?.name[0] : "",
                                shortcode: error_array?.shortcode != undefined ? error_array?.shortcode[0] : "",
                                team: error_array.team_id != undefined ? error_array.team_id[0] : "",
                                role: error_array.role_name != undefined ? error_array.role_name[0] : "",
                            }
                    });
                    this.setState({showLoader: false});
              //  console.log(this.state.errors);
            }
        });
    }

    nameChangeHandler(event: any) {
        let value :string  = event.target.value;
        let shortcode_arr = value.split(" ");
        let shortcode = "";
        for(var i of shortcode_arr) {
            shortcode = shortcode + i.charAt(0).toUpperCase();
        }
        this.setState( {user:{...this.state.user, name: event.target.value, shortcode:shortcode}, pencil: false} );
      }

    render() {
        const t = this.props.t;
        return (
            <Fragment>
                { this.state.showLoader ? <LoaderBar/> : ""}
                <tr>
                    <th scope="row"
                        className="text-left">
                        <input
                            className={`${!this.state.pencil ?  'form-control' : 'team-input'}`}
                            type="text"
                            value={this.state.user.name}
                            onChange={this.nameChangeHandler.bind(this)}
                        />
                        <br/>
                        {this.state.errors.name ? <span className="text-danger">{this.state.errors.name}</span>:""}
                        {this.state.updated ?  <span className="text-success">{t('User updated successfully')}</span> : ""}
                    </th>
                    <td><span className="shortcode-box"><input type="text"
                                     className="team-input"
                                     readOnly
                                     value={this.state.user.shortcode}
                                     style={{
                                         paddingLeft: '25px',
                                     }}
                                     /></span></td>
                    <td>
                        <select name="Admin"
                                className="form-control"
                                value={this.state.user.role_name}
                                onChange={(e) => this.setState({user:{...this.state.user,role_name:e.target.value}, pencil: false})}
                                defaultValue={this.props.user.role.role_name}>
                            <option value="">{t('Select role')}</option>
                            {this.props
                                .roles
                                .map(
                                    (role)=>

                                    <option key={role.role_name} value={role.role_name}>{role.role_name}</option>
                                )}
                        </select>
                        <br/>
                        {this.state.errors.role ? <span className="text-danger bg-white">{this.state.errors.role}</span>:""}
                    </td>
                    <td>
                        <select name="team_id"
                                className="form-control"
                                onChange={(e) => this.setState({user:{...this.state.user,team_id:e.target.value}, pencil: false})}
                                defaultValue={this.props.user.team_id as string}>
                            <option value="">{t('Select team')}</option>
                            {this.props
                                .teams
                                .map(
                                    (team)=>
                                    <option key={team.id} value={team.id}>{team.team_name}</option>
                                )}
                        </select>
                        <br/>
                        {this.state.errors.team ? <span className="text-danger bg-white">{this.state.errors.team}</span>:""}
                    </td>
                    <td>
                        <i className={`fa-btn fa ${this.state.pencil ? 'fa-pencil' : 'fa-check'} `} aria-hidden="true" onClick={this.updateUserDetails.bind(this)}></i>
                    </td>
                </tr>
            </Fragment>
        );
    }
}

export default withTranslation()(UserListItem);
