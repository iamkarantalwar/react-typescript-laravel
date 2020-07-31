import React, { Component, Fragment } from 'react';
import { ITap } from '../../app/models/tap.model';
import Axios from 'axios';
import { TapTimer, endPoints, TapTimerObservable, TapStaticObservable } from '../../app/api/agent';
import { enviorment } from '../../../enviorment';
import { forkJoin, from, of, Observable, concat, combineLatest } from 'rxjs'
import { tap, mergeMap, concatAll, combineAll, concatMap, flatMap } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax';
import { ITapTimer } from '../../app/models/tap-timer.model';
import LoaderBar from '../../app/common/LoaderBar';
import TapListItem from './TapListItem';
import { ITapStatic } from '../../app/models/tap-static.model';
import { RootState } from '../../redux';
import { connect } from 'react-redux';
import { IProjectSetting, ProjectSettingStatus } from '../../app/models/project-setting.model';

const mapStateToProps = (state: RootState) => ({
    projectSettings: state.projectSettings.projectSettings,
});

type ReduxProps = ReturnType<typeof mapStateToProps>;

interface IProps extends ReduxProps
{
    taps?: ITap[];
}

interface IState
{
    subscribed: boolean;
}

class Taps extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state= {
            subscribed: false,
        }
    }

    getTimers(): Observable<ITapTimer[]> {
        const taps = this.props.taps as ITap[];
        const taps_ids = taps.map((tap) => tap.id);
        return ajax.getJSON<ITapTimer[]>(`${enviorment.baseUrl}/${endPoints.tapRounds}?tap_id=${taps_ids.join(',')}`);
        // return ajax.getJSON<ITapTimer[]>(`${enviorment.baseUrl}/${endPoints.tapRounds}?tap_id=${taps_ids.join(',')}`)
        //     .pipe(mergeMap(timers => {
        //         const settings = this.props.projectSettings.filter((setting)=> setting.aktiv == ProjectSettingStatus.ACTIVE);
        //         let tapTimersToBeStore : ITapTimer[] = [];
        //         settings.forEach((setting) => {
        //             const match = timers.find(timer_ => timer_.project_setting_id == setting.id);
        //             if(!match) {
        //                 let timer_: ITapTimer = {
        //                     project_setting_id: setting.id as number,
        //                     spulzeit_status: false,
        //                     wirkzeit_status: false,
        //                     tap_id: 1,
        //                     spulzeit_pending_timer: null,
        //                     wirkzeit_pending_timer: null,
        //                     spulzeit_timer_started: null,
        //                     wirkzeit_timer_started: null,
        //                 }
        //                 tapTimersToBeStore.push(timer_);
        //             }
        //         });
        //         return ajax.post(`${enviorment.baseUrl}/${endPoints.tapRounds}`, tapTimersToBeStore) as Observable<ITapTimer[]>;
        //     }));
    }

    getTapStatics(): Observable<ITapStatic[]> {
        const taps = this.props.taps as ITap[];
        const taps_ids = taps.map((tap) => tap.id);
        return ajax.getJSON(`${enviorment.baseUrl}/${endPoints.tapStatics}?tap_id=${taps_ids.join(',')}`);
    }

    getTapDetails  = () => {
        return forkJoin(this.getTimers(), this.getTapStatics());
    }

    //  saveTapTimers = () : Observable<any> => {


    //     const c =  this.getTimers().pipe(flatMap(timers => {
    //         console.log(timers);
    //         let tapTimersToBeStore : ITapTimer[] = [];
    //         let tapTimers: ITapTimer[] = [];

    //             settings.forEach((setting) => {
    //                 const match = timers.find(timer_ => timer_.project_setting_id == setting.id);
    //                 if(!match) {
    //                     let timer_: ITapTimer = {
    //                         project_setting_id: setting.id as number,
    //                         spulzeit_status: false,
    //                         wirkzeit_status: false,
    //                         tap_id: 1,
    //                         spulzeit_pending_timer: null,
    //                         wirkzeit_pending_timer: null,
    //                         spulzeit_timer_started: null,
    //                         wirkzeit_timer_started: null,
    //                     }
    //                     tapTimersToBeStore.push(timer_);
    //                 } else {
    //                     tapTimers.push(match);
    //                 }
    //             });
    //             return ajax.post(`${enviorment.baseUrl}/${endPoints.tapRounds}`, tapTimersToBeStore);
    //         }
    //     ));
    //     return c;
    //  }

     tapListItems: any[]  = [];

    componentDidMount()
    {
        this.getTapDetails().subscribe((res) => {
            const taps = this.props.taps as ITap[];
            for(let i=0; i<taps.length; i++)
            {
                const tapTimers = res[0].filter((timer: ITapTimer) => timer.tap_id == taps[i].id);
                const tapStatics = res[1].filter((stat: ITapStatic) => stat.taps_id == taps[i].id);
                this.tapListItems.push(<TapListItem key={i} tapTimers={tapTimers} tapStatics={tapStatics} tap={taps[i]}/>)
            }
            this.setState({
                subscribed: true,
            });
        });
    }
    render() {

        return (
            this.state.subscribed ? this.tapListItems : <LoaderBar/>
        );
    }
}

export default connect(mapStateToProps)(Taps);
