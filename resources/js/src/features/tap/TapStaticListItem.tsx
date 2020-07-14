import React, { Component } from 'react';

interface IProps {

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
        return (
            <div id=""  className="tap-card card-body pr-0 pt-2" data-parent="#accordion" style={{padding: '0 2rem !important'}}>
                <div id="accordion-inner-rooms" className="accordion-inner-rooms">
                    <div className="card mb-0 border-0">
                        <div className={`card-header mb-1`} data-toggle="collapse" >
                            <div className="main-room-overview d-flex justify-content-between">
                                <div className="overview-floor-list w-100">
                                    <div className="row">
                                        <div className="col-md-4">
                                        
                                        </div>
                                        <div className="col-md-6">
                                            
                                        </div>
                                        <div className="col-md-2">
                                            
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

export default TapStaticListItem;
