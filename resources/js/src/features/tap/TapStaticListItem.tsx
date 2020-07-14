import React, { Component } from 'react';
import { ITapStatic } from '../../app/models/tap-static.model';
import { connect } from 'react-redux';
import { RootState } from '../../redux';

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

}

class TapStaticListItem extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
        }
    }

    
    render() {
        const users = this.props.users.users;
        const { tapStatic } = this.props; 
        const timeStamp = new Date(tapStatic.created_at as Date);
        const date = timeStamp?.getDate() + "/" + (timeStamp?.getMonth() + 1) + "/" + (timeStamp?.getFullYear());
        const time = timeStamp?.getHours() + ":" + timeStamp?.getMinutes();
        return (
            <div id=""  className="container tap-static-card card-body pr-0 pt-2" data-parent="#accordion" style={{padding: '0 2rem !important'}}>
                <div id="accordion-inner-rooms" className="accordion-inner-rooms">
                    <div className="card mb-0 border-0">
                        <div className={`card-header mb-1`} data-toggle="collapse" >
                            <div className="main-room-overview d-flex justify-content-between">
                                <div className="overview-floor-list w-100">
                                    <div className="row container">
                                        <div className="col-md-2">
                                            {tapStatic?.setting?.field_name} 
                                        </div>
                                        <div className="col-md-2">
                                            {tapStatic?.detected == true ? "Detected" : "Not Detected"}
                                        </div>
                                        <div className="col-md-3">
                                            {date} {time}
                                        </div>
                                        <div className="col-md-3">
                                            { tapStatic?.user?.name}                                          
                                        </div>
                                        <div className="col-md-1">
                                            <i className={"fa fa-pencil"}></i>
                                        </div>
                                    </div>                      
                                </div>     
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(TapStaticListItem);
