import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface IProps extends RouteComponentProps {}


export class BottomHeader extends Component<IProps> {
    constructor(props: IProps) {
        super(props);        
    }
    render() {
        const path = this.props.location.pathname.split("/")[1];
        const title = path.length === 0 ? "Dashboard" : path.charAt(0).toUpperCase() + path.slice(1);
        return (
            <div>
                <section className="test-project mt-5">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <div className="test-proj-tittel">
                                        <h3 className="font-weight-normal">{title}</h3>
                                        <p><i className="fa fa-home" aria-hidden="true"></i> - {title} </p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="test-proj-date text-right">
                                        <p>Heute:<a href="#"> 01 April</a></p>
                                    </div>
                                </div>
                            </div>            
                        </div>
                </section>                
            </div>
        );
    }
}

export default withRouter(BottomHeader);
