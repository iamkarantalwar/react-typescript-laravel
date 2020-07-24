import React, { Component, Fragment } from 'react';
import { ITap } from '../../app/models/tap.model';
import { IProjectSetting, ProjectSettingStatus } from '../../app/models/project-setting.model';
import { TapStatic, TapTimer } from '../../app/api/agent';
import { withRouter, RouteComponentProps } from 'react-router';
import { ITapStatic } from '../../app/models/tap-static.model';
import { TapStaticStateEnum } from './TapStaticStateEnum';
import { RootState } from '../../redux';
import { connect } from 'react-redux';
import { Collapse } from 'react-bootstrap';
import TapStaticListItem from './TapStaticListItem';
import { ITapTimer } from '../../app/models/tap-timer.model';
import { SettingsField } from '../../app/enums/settings-field.enum';



interface RouteParam {
    id: string;
}
const mapStateToProps = (state: RootState) => ({
    projectSettings: state.projectSettings,
});

type ReduxProps = ReturnType<typeof mapStateToProps>;

interface IProps extends ReduxProps,RouteComponentProps<RouteParam> {
    tap: ITap;
    tapDetecting: boolean;
    toggleTapDetecting: () => void;
}

interface IState {
    settings: IProjectSetting[];
    tapStatics: ITapStatic[];
    pendingStatics: IProjectSetting[];
    tapStaticState?: TapStaticStateEnum;
    selectedPendingTapId?: number;
    tapStatus: JSX.Element | undefined;
    showTapStatics: boolean;
    tapTimers: ITapTimer[];
    detectingField?: SettingsField;
    timer: number;
}

class TapListItem extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            pendingStatics: [],
            settings: [],
            tapStatics: [],
            tapStaticState: undefined,
            selectedPendingTapId: undefined,
            tapStatus: undefined,
            showTapStatics: false,
            tapTimers: [],
            detectingField: undefined,
            timer:0,
        }
    }

    interval: any;

    componentDidMount() {
        const projectId = this.props.match.params.id;
        const settings = this.props.projectSettings.projectSettings.filter((setting)=> setting.aktiv == ProjectSettingStatus.ACTIVE);
        this.setState({settings: settings});

        //Fetch All The Timers
        TapTimer.getTapTimers(this.props.tap)
        .then(timers => {
            //Make Two Objects TimersToBeStore and TapTimers
            let tapTimersToBeStore : ITapTimer[]  = [];
            let tapTimers: ITapTimer[] = [];

            settings.forEach((setting) => {
                const match = timers.find(timer_ => timer_.project_setting_id == setting.id);
                if(!match) {
                    let timer_: ITapTimer = {
                        project_setting_id: setting.id as number,
                        spulzeit_status: false,
                        wirkzeit_status: false,
                        tap_id: this.props.tap.id,
                        spulzeit_pending_timer: null,
                        wirkzeit_pending_timer: null,
                        spulzeit_timer_started: null,
                        wirkzeit_timer_started: null,
                    }
                    tapTimersToBeStore.push(timer_);
                } else {
                    tapTimers.push(match);
                }
            });

            //Check If To Be Saved Has Any Object If it has then call the API
            if(tapTimersToBeStore.length > 0) {
                TapTimer.saveTapTimers(tapTimersToBeStore)
                .then((timers) => { tapTimers.push(...timers); this.setState({tapTimers: tapTimers}); })
            } else {
                this.setState({tapTimers: tapTimers});
            }               
           

            TapStatic.getTapStatics(this.props.tap.id)
            .then((tapsStatics) => { 
                const pendingStatics = settings.filter((setting) => !tapsStatics.some((tapStatic) => tapStatic.project_setting_id == setting.id));
                this.setState({ 
                    tapStatics: tapsStatics,
                    pendingStatics: pendingStatics,
                });
                this.checkTapStaticState(settings, pendingStatics);                
            });           
            
        });

    }

    checkTapStaticState = (settings = this.state.settings, pendingStatics = this.state.pendingStatics) => {
        let tapStaticState: TapStaticStateEnum | undefined;
        if(pendingStatics.length == settings.length) {
            tapStaticState = TapStaticStateEnum.PENDING;
            this.setState({selectedPendingTapId: pendingStatics[0]?.id});
            this.showPendingTap(pendingStatics[0]?.id);
        } else if(pendingStatics.length>0) {
            !this.state.selectedPendingTapId ? this.setState({selectedPendingTapId: pendingStatics[0]?.id}) : "";
            this.showPendingTap(pendingStatics[0]?.id);
            tapStaticState = TapStaticStateEnum.IPROGRESS;
        } else if(pendingStatics.length === 0) {
            this.showCompletedTap();
            tapStaticState = TapStaticStateEnum.COMPLETED;
        }
        this.setState({ tapStaticState: tapStaticState});
    }

    showCompletedTap = () =>{
        this.setState({tapStatus: <div></div>});
    }

    showInProgressTap = (timer: string, field: SettingsField, tapTimer: ITapTimer, detectingBeforeClosing: boolean = false) => {
        let time: string = "";
        //Extract the numeric value from the Timer
            for(let i of timer.toString()) {
                if(!isNaN(Number(i))) {
                    time+=i;
                }
            }
        

        //Check If Other Tap Is detecting 
        if (this.props.tapDetecting) {
            //Alert The message Annother Tap Is Detecting
            alert("Another tap is Detecting. Please Wait");
        }  else {
            //Check if the Field Wirzekut have valid Value 
            if(Number(time)==0) {
                alert('Ask Admin to set timer.');
            } else {     
                //Tell The Agent To Store It In The Back-end
                if(!detectingBeforeClosing) {
                    this.timerStartAgent(field, tapTimer);
                }               
                //Change the Prop to detecting 
                //this.props.toggleTapDetecting();
                //Change The State of the tap to tell which setting is detecting
                this.setState({detectingField: field});

                const now = new Date();
                const current_time = now.getHours() + ":" + now.getMinutes();
                const current_date = now.getDate() + "/" + (now.getMonth()+1) + "/" + now.getFullYear();
                let increment = -1;
                if(!this.interval) {
                    this.interval = setInterval(() => {
                        increment = increment + 1;
                        let remaining_seconds = Number(timer)-increment;
                        var hrs:any   = Math.floor(remaining_seconds / 3600);
                        remaining_seconds  -= hrs*3600;
                        const hours = hrs.toString().length == 1 ? `0${hrs}` : hrs;
                        var mnts = Math.floor(remaining_seconds / 60);
                        remaining_seconds  -= mnts*60;
                        const minutes = mnts.toString().length == 1 ? `0${mnts}` : mnts;
                        const progressTap: JSX.Element = <div className="row">
                                                        <div className="col-md-4">
                                                            {current_date}
                                                        </div>
                                                        <div className="col-md-4">
                                                            {current_time}
                                                        </div>
                                                        <div className="col-md-4">
                                                            <i className="fa fa-clock-o mr-1"></i>
                                                              {hours + ' : ' + minutes + ' : ' + remaining_seconds}
                                                        </div>
                                                    </div>;
                        if(Number(timer)-increment != 0) {
                            this.setState({tapStatus: progressTap, tapStaticState: TapStaticStateEnum.DETECTING});                        
                        } else if(Number(timer)-increment == 0) {
                            clearInterval(this.interval);
                            //let tap timer
                            let tapTimer_: ITapTimer = Object.assign({}, this.state.tapTimers.find((timer=>timer.id == tapTimer.id)));  
                            // Check the field and update the status
                            if(field == SettingsField.wirkzeit) {
                                //Change the Status Of The Timer
                                tapTimer_.wirkzeit_status = true;
    
                            } else if(field == SettingsField.spulzeit) {
                                //Change the Status Of The Timer
                                tapTimer_.spulzeit_status = true;
                            }
                            //Call the Agent To Mark Completed in server 
                            this.settingTimerCompletedAgent(tapTimer_);
                            //Change The State of The Timer
                            const timers: ITapTimer[] = this.state.tapTimers.map((timer) => timer.id == tapTimer_.id ? tapTimer_ : timer);
                            this.setState({tapTimers: timers});
                            //Recheck the status
                            this.checkTapStaticState();
                           // this.props.toggleTapDetecting();
                           this.interval = null;
                        } else {
                            console.log('not stopped');
                        }
                    }, 1000);
                }                
            }
        }
    }

    timerStartAgent = (field: SettingsField, tapTimer: ITapTimer) => {
        TapTimer.startTapTimer(field, tapTimer)
        .then((res) => {
            const timerIndex = this.state.tapTimers.findIndex((timer) => timer.id == tapTimer.id);
            let stateTimers = [
                ...this.state.tapTimers
            ];
            stateTimers[timerIndex] = res;
            this.setState( {tapTimers: stateTimers} );
        });
    }

    notDetected = (setting: IProjectSetting) => {
        this.tapStaticAgent(setting, false);
    }

    detected = (setting: IProjectSetting) => {
        this.tapStaticAgent(setting, true);
    }


    settingTimerCompletedAgent = (tapTimer: ITapTimer) => {
        TapTimer.updateTapTimer(tapTimer)
        .then(res => console.log(res));
    }

    tapStaticAgent = (setting: IProjectSetting, detected: boolean) => {
        this.setState({tapStatus: undefined});
        let tapStatic: ITapStatic = {
            detected:detected,
            project_setting_id: setting?.id as number,
            taps_id: this.props.tap.id,
        }

        TapStatic
        .createTapStatic(tapStatic)
        .then((res) => { 
            //Chnage The Pending Static Information
            const pendingStatics = this.state.pendingStatics.filter((stat) => stat.id != setting.id);
            this.setState({pendingStatics: pendingStatics, selectedPendingTapId: pendingStatics[0]?.id});
            this.checkTapStaticState(this.state.settings, pendingStatics);

             //Append Setting Item Into Stat List State
             let statics = this.state.tapStatics;
             statics.push(res);
             //Set the state 
             this.setState({tapStatics: statics})
        })
        .catch((err) => console.log(err))
    }

    tapItemBackgroundClass = () => {
        if (this.state.tapStaticState == TapStaticStateEnum.COMPLETED) {
            return 'bg-success';
        } else if(this.state.tapStaticState == TapStaticStateEnum.IPROGRESS) {
            return 'bg-warning';
        } else if(this.state.tapStaticState == TapStaticStateEnum.DETECTING) {
            return 'bg-danger';
        } else {
            return 'bg-default';
        }
    }


    showPendingTap = (id = this.state.selectedPendingTapId) => {
        let setting : IProjectSetting = this.state.settings.find((stat)=> stat.id == id) as IProjectSetting;;
        let timer : ITapTimer = this.state.tapTimers.find((timer_) => timer_.project_setting_id == setting.id) as ITapTimer;
        while (timer == undefined) {
            setting = this.state.settings.find((stat)=> stat.id == id) as IProjectSetting;
            timer = this.state.tapTimers.find((timer_) => timer_.project_setting_id == setting.id) as ITapTimer;
            setTimeout(()=>{}, 200);
            console.log('timer', '-------', timer);
            console.log('settings', '-------', setting);
        }
        if (timer.wirkzeit_status == false && timer.wirkzeit_timer_started == null) {
            this.setState({ 
                tapStatus: <div className="row">
                        <div className="col-md-6">
                            {setting?.field_name}
                        </div> 
                        <div className="col-md-6">
                           <button 
                               className="tap-btn"
                               onClick={this.showInProgressTap.bind(this, setting.field_wirkzeit, SettingsField.wirkzeit, timer, false)}>
                                    Start Wirkzeit
                            </button>
                        </div> 
                    </div>
            });
        } else if(timer.wirkzeit_status == false && timer.wirkzeit_pending_timer != null) {
            this.showInProgressTap(timer.wirkzeit_pending_timer, SettingsField.wirkzeit, timer, true);
        }         
        else if (timer.spulzeit_status == false && timer.spulzeit_pending_timer == null && timer.wirkzeit_status  == true) {
            this.setState({
                tapStatus: <div className="row">
                        <div className="col-md-6">
                            {setting?.field_name}
                        </div> 
                        <div className="col-md-6">
                            <button
                                className="tap-btn" 
                                onClick={this.showInProgressTap.bind(this, setting.field_spulzeit, SettingsField.spulzeit, timer, false)}>
                                    Start Spulzeit
                            </button>
                        </div> 
                    </div>
            });
        } 
        else if(timer.spulzeit_status == false && timer.spulzeit_pending_timer != null && timer.wirkzeit_status == true) {
            this.showInProgressTap(timer.spulzeit_pending_timer, SettingsField.spulzeit, timer, true);
        }  
        else if(timer.spulzeit_status == true && timer.wirkzeit_status == true) {
            this.setState({tapStatus: <div className="row">
                                        <div className="col-md-6">
                                            {setting?.field_name} Detected
                                        </div> 
                                        <div className="col-md-6">
                                            <span className="tap-check mr-2" onClick={(e) => this.detected(setting)}>
                                                <i className="fa fa-check" ></i>
                                            </span>
                                            <span className="tap-times" onClick={(e) => this.notDetected(setting)}>
                                                <i className="fa fa-times" ></i>
                                            </span>
                                        </div> 
                                    </div>
            });

        }
    }

    toggleTapStatics = (event: any) => {
        if (event.target.tagName != 'button') 
            this.setState({showTapStatics: !this.state.showTapStatics});
    }

    componentWillUnmount() {
        if(this.interval) {
            clearInterval(this.interval);
        }
    }

    render() {
        return (
        <Fragment>
            <div 
                id=""  
                className="tap-card card-body pr-0 pt-2 cursor-pointer" 
                data-parent="#accordion" 
                style={{padding: '0 2rem !important'}}
                aria-controls={`collapse-tap-${this.props.tap.id}`}
                aria-expanded={this.state.showTapStatics}    
                onClick={(e) => this.toggleTapStatics(e)}>

                <div id="accordion-inner-rooms" className="accordion-inner-rooms">
                    <div className="card mb-0 border-0">
                    <div className={`card-header ${this.tapItemBackgroundClass()} mb-1`} data-toggle="collapse" >
                        <div className="main-tap-overview d-flex justify-content-between">
                            <div className="overview-floor-list w-100">
                                <div className="row">
                                    <div className="col-md-4 pl-4 pt-2">
                                        {this.props.tap.name}
                                    </div>
                                    <div className="col-md-6 pl-4 pt-2">
                                        {
                                            this.state.tapStatus ? this.state.tapStatus : 'Loading.....' 
                                        }
                                    </div>
                                    <div className="col-md-2">
                                            <i 
                                              className={`fa ${this.state.showTapStatics ? 'fa-angle-down' : 'fa-angle-up' } 
                                              text-dark font-weight-bold ml-2`}>
                                            </i>
                                    </div>
                                </div>                      
                            </div>     
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <Collapse in={this.state.showTapStatics}>
            <div className="collapse" id={`collapse-tap-${this.props.tap.id}`}>
                {
                  this.state.showTapStatics ?  
                        <Fragment>
                        {
                            this.state.tapStatics.map((tap, index) => {
                                        return <TapStaticListItem key={index} tapStatic={tap}/>;
                                })
                        }
                        </Fragment> : ''
                }
            </div>
            </Collapse>
        </Fragment>
        );
    }
}

export default withRouter(connect(mapStateToProps)(TapListItem));
