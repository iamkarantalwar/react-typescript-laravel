import React, { Component, PureComponent } from 'react';
import { PumpStart } from '../../app/api/agent';
import { IProjectSetting } from '../../app/models/project-setting.model';
import { IPumpstartOfProduct } from '../../app/models/pumpstart-of-product.model';

interface IProps {
   pumpstart: IPumpstartOfProduct;
   projectSetting: IProjectSetting;
}

interface IState {
    pumpstart: IPumpstartOfProduct;
}

class PumpstartListItem extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            pumpstart: {
                ...this.props.pumpstart
            }
        }
    }

    updatePumpstart = () => {
        PumpStart.updatePumpStart(this.state.pumpstart)
        .then((res) => alert('Pumpstart Updated Succesffuly. '))
        .catch((err) => alert('Something went wrong. Try agaian later.'))
    }

    render() {
        return (
            <div
                className="floor-one-box card-header
                           d-flex align-items-center
                           justify-content-between
                           cursor-pointer mb-4 row
                           mx-0 my-1">
                <div className="col-md-3">
                    { this.props.projectSetting?.field_name }
                </div>
                <div className="col-md-3">
                   <input
                       type="date"
                       className="form-control"
                       value={this.state.pumpstart.pumpstart_date}
                       onChange={(e) => this.setState({ pumpstart: {...this.state.pumpstart, pumpstart_date: e.target.value} })}
                    />
                </div>
                <div className="col-md-3">
                    <input
                       type="time"
                       className="form-control"
                       value={this.state.pumpstart.pumpstart_time}
                       onChange={(e) => this.setState({ pumpstart: {...this.state.pumpstart, pumpstart_time: e.target.value} })}
                    />
                </div>
                <div className="col-md-3">
                    <i onClick={(e) => this.updatePumpstart()} className="fa fa-check"></i>
                </div>
            </div>
        );
    }
}

export default PumpstartListItem;
