import React, { PureComponent } from 'react';
import { IProjectSetting } from '../../app/models/project-setting.model';
import { IPumpstartOfProduct } from '../../app/models/pumpstart-of-product.model';
import PumpstartListItem from './PumpstartListItem';
import { PumpStart } from '../../app/api/agent';

interface IProps {
    projectSettings: IProjectSetting[];
}

interface IState {
    pumpStarts: IPumpstartOfProduct[];
    loader: boolean,
    pendingSettings: IProjectSetting[];
}

class Pumpstart extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            pumpStarts: [],
            pendingSettings: [],
            loader:false,
        }
    }

    componentDidMount(){
        PumpStart.getProjectPumpStart(this.props.projectSettings[0].project_id.toString())
        .then((pumpstarts) => {
            const pendingSettings = this.props.projectSettings.filter((setting) => pumpstarts.some((pumpstart) => pumpstart.project_setting_id == setting.id?.toString() ) ? false : true );
            this.setState({pumpStarts: pumpstarts, pendingSettings: pendingSettings});
        })
        .catch((err) => alert('Something went wrong. Try again later. '));
    }

    startPumpStart = (setting: IProjectSetting) => {
        PumpStart.createProjectPumpStart({
            project_id: setting.project_id.toString(),
            project_setting_id: setting.id?.toString() as string,
        }).then((pumpstart) => this.setState({ pumpStarts: [
            ...this.state.pumpStarts,
            pumpstart,
        ], pendingSettings: this.state.pendingSettings.filter((setting_) => setting_.id != setting.id)}) )
        .catch((err) => alert('Something went wrong. Try again later.'))
    }

    render() {
        return (
            <div className="mb-4">
                {
                    this.state.pendingSettings.length >  0 ?
                    <a className="main-btn" style={{width: 'auto'}} onClick={(e) => this.startPumpStart(this.state.pendingSettings[0])}>
                       Pump Start ({this.state.pendingSettings[0].field_name})
                    </a> : null
                }
                {
                    this.props.projectSettings.length > 0 && this.state.pumpStarts.length > 0 ?  this.state.pumpStarts.map((pumpstart) => <PumpstartListItem
                                                                projectSetting={this.props.projectSettings.find((setting) => (setting.id as number).toString() == pumpstart.project_setting_id) as IProjectSetting}
                                                                pumpstart={pumpstart}
                                                            />) : null
                }
                <hr/>
            </div>
        );
    }
}

export default Pumpstart;
