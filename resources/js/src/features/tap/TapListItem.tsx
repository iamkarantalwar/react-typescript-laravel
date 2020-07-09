import React, { Component } from 'react';
import { ITap } from '../../app/models/tap.model';

interface IProps {
    tap: ITap;
}

interface IState {

}

class TapListItem extends Component<IProps, IState> {
    render() {
        return (
            <div id=""  className="tap-card card-body pr-0 pt-2" data-parent="#accordion" style={{padding: '0 2rem !important'}}>
                <div id="accordion-inner-rooms" className="accordion-inner-rooms">
                    <div className="card mb-0 border-0">
                    <div className="card-header  mb-1" data-toggle="collapse" >
                        <div className="main-room-overview d-flex justify-content-between">
                            <div className="overview-floor-list">
                                <a className="card-title">
                                    {this.props.tap.name}
                                </a>
                            </div>     
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TapListItem;
