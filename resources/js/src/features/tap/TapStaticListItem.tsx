import React, { Component } from 'react';
import { ITapStatic } from '../../app/models/tap-static.model';
import { connect } from 'react-redux';
import { RootState } from '../../redux';
import { TapStatic, User } from '../../app/api/agent';
import LoaderBar from '../../app/common/LoaderBar';
import { ITapTimer } from '../../app/models/tap-timer.model';
import { userObject } from '../../context/UserContext';
import { UserRoles } from '../../app/models/role.model';

const mapStateToProps = (state: RootState) => {
    return {
        users: state.users
    }
}

type ReduxProps = ReturnType<typeof mapStateToProps>;

interface IProps extends ReduxProps  {
    tapStatic: ITapStatic;
}

interface IState {
    tapStatic: ITapStatic;
    editable: Boolean;
    loader:boolean;
    message: string;
    messageClass: string;
}

class TapStaticListItem extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            tapStatic: {
                ...this.props.tapStatic
            },
            editable: false,
            loader: false,
            message: '',
            messageClass: '',
        }
    }

    submitHandler = () => {
        if (!this.state.editable) {
            return;
        }
        this.setState({loader: true});
        TapStatic
        .updateTapStatic(this.state.tapStatic)
        .then((res) => {
            this.setState({tapStatic: res, message: "Tap Information updated successfully.", messageClass: 'success', editable: false});
            setTimeout(() => {
                this.setState({ message: '', messageClass: ''});
            }, 2000);

        })
        .catch((err) => {
            this.setState({message: "Tap Information Not Updated successfully.", messageClass: 'danger'});
            setTimeout(() => {
                this.setState({message: '', messageClass: ''});
            }, 4000);
        })
        .finally(()=>{
            this.setState({loader: false});
        });
    }

    changeSubstanceTimers = (event: any) => {
        console.log(event);
        let timer_: ITapTimer = {
            ...this.state.tapStatic.timer
        } as ITapTimer;
        this.setState( {editable: true} );

        if(event.target.name == 'wirkzeit_timer_started_date') {
            this.setState( {tapStatic: {...this.state.tapStatic, timer : {...timer_, wirkzeit_timer_started_date: event.target.value} }});
        } else if(event.target.name == 'wirkzeit_timer_started_time') {
            this.setState( {tapStatic: {...this.state.tapStatic, timer : {...timer_, wirkzeit_timer_started_time: event.target.value} }});
        } else if (event.target.name == 'spulzeit_timer_started_date') {
            this.setState( {tapStatic: {...this.state.tapStatic, timer : {...timer_, spulzeit_timer_started_date: event.target.value} }});
        } else if(event.target.name == 'spulzeit_timer_started_time') {
            this.setState( {tapStatic: {...this.state.tapStatic, timer : {...timer_, spulzeit_timer_started_time: event.target.value} }});
        } else if(event.target.name == 'wirkzeit_timer_started_user_id') {
            this.setState( {tapStatic: {...this.state.tapStatic, timer : {...timer_, wirkzeit_timer_started_user_id: event.target.value} }});
        } else if(event.target.name == 'spulzeit_timer_started_user_id') {
            this.setState( {tapStatic: {...this.state.tapStatic, timer : {...timer_, spulzeit_timer_started_user_id: event.target.value} }});
        }

    }

    render() {
        const users = this.props.users.users;
        const { tapStatic } = this.state;
        return (
            this.state.loader ? <LoaderBar/> :
            <div id=""  className="tap-static-card card-body pr-0 pt-2" data-parent="#accordion" style={{padding: '0 2rem !important'}}>
                <div id="accordion-inner-rooms" className="accordion-inner-rooms">
                    <div className="card mb-0 border-0">
                        <div className={`card-header mb-1 border border-${this.state.messageClass ? this.state.messageClass : 'default'}`} data-toggle="collapse" >
                            <div className="row mx-2">
                                <div className='col-sm-3 text-center'>
                                    <b>Wirzekuit:</b>
                                </div>
                                <div className='col-sm-3'>
                                    <input
                                    className='form-control p-2'
                                    type='date'
                                    name='wirkzeit_timer_started_date'
                                    onChange={this.changeSubstanceTimers}
                                    value={tapStatic.timer?.wirkzeit_timer_started_date}/>
                                </div>
                                <div className='col-sm-3'>
                                    <input
                                    className='form-control p-2'
                                    type='time'
                                    name='wirkzeit_timer_started_time'
                                    onChange={this.changeSubstanceTimers}
                                    value={tapStatic.timer?.wirkzeit_timer_started_time}/>
                                </div>
                                <div className='col-sm-3'>
                                    <select
                                    className='form-control'
                                    value={tapStatic.timer?.wirkzeit_timer_started_user_id as number}
                                    name='wirkzeit_timer_started_user_id'
                                    onChange={this.changeSubstanceTimers}>
                                        {
                                            this.props.users.users.map((user, index) => <option key={index} value={user.id}>{user.name}</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                            <hr className="m-1"/>
                            <div className="row mx-2">
                                    <div className='col-sm-3 text-center'>
                                        <b>Spulziet: </b>
                                    </div>
                                    <div className='col-sm-3'>
                                        <input
                                        className='form-control p-2'
                                        type='date'
                                        onChange={this.changeSubstanceTimers}
                                        name='spulzeit_timer_started_date'
                                        value={tapStatic.timer?.spulzeit_timer_started_date}/>
                                    </div>
                                    <div className='col-sm-3'>
                                        <input
                                        className='form-control p-2'
                                        type='time'
                                        onChange={this.changeSubstanceTimers}
                                        value={tapStatic.timer?.spulzeit_timer_started_time}/>
                                    </div>
                                    <div className='col-sm-3'>
                                        <select
                                        name='spulzeit_timer_started_user_id'
                                        className='form-control'
                                        value={tapStatic.timer?.spulzeit_timer_started_user_id as number}
                                        onChange={this.changeSubstanceTimers}>
                                            {
                                                this.props.users.users.map((user, index) => <option key={index} value={user.id}>{user.name}</option>)
                                            }
                                        </select>
                                    </div>
                                </div>
                            <hr className='m-1'/>
                            <div className="main-room-overview d-flex justify-content-between">

                                <form className="w-100">
                                    <div className="overview-floor-list w-100">
                                        <div className="row px-3 mx-2 px-md-0 mx-md-0">
                                            <div className="col-md-2 p-2 text-center">
                                                {tapStatic?.setting?.field_name}
                                            </div>
                                            <div className="col-md-3 px-0">
                                                <select
                                                    defaultValue={tapStatic?.detected.toString()}
                                                    className="form-control"
                                                    onChange={(e) => this.setState({tapStatic: {...this.state.tapStatic, detected: eval(e.target.value) as boolean}, editable: true})}
                                                >
                                                    <option value='1'>Detected</option>
                                                    <option value='0'>Not Detected</option>
                                                </select>
                                            </div>
                                            <div className="col-md-2 px-0 px-md-1">
                                                <input
                                                    type='date'
                                                    className='form-control'
                                                    value={tapStatic?.date}
                                                    onChange={(e) => this.setState({tapStatic: {...this.state.tapStatic, date: e.target.value}, editable: true})}
                                                />
                                            </div>
                                            <div className="col-md-2 pr-md-1 px-0">
                                                <input
                                                    type='time'
                                                    className='form-control'
                                                    value={tapStatic?.time}
                                                    onChange={(e) => this.setState({tapStatic: {...this.state.tapStatic, time: e.target.value}, editable: true})}
                                                />
                                            </div>
                                            <div className="col-md-2 px-0">
                                                <select
                                                className='form-control'
                                                defaultValue={tapStatic?.user_id}
                                                onChange={(e) => this.setState({tapStatic: {...this.state.tapStatic, user_id: parseInt(e.target.value)}, editable: true})}
                                                >
                                                    {
                                                        this.props.users.users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)
                                                    }
                                                </select>
                                            </div>
                                            {
                                                userObject.role == UserRoles.ADMIN ?
                                                <div className="col-md-1">
                                                    <i onClick={this.submitHandler} className={`fa ${!this.state.editable ? 'fa-pencil' : 'fa-check'}`}></i>
                                                </div> : ''
                                            }
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {this.state.message ? <span className={`text-${this.state.messageClass} project-list-item-message`}>{this.state.message}</span> : ""}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(TapStaticListItem);
