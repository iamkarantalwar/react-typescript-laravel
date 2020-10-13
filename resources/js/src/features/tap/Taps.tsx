import React, { Component, Fragment } from 'react';
import { ITap } from '../../app/models/tap.model';
import Axios from 'axios';
import { TapTimer, endPoints, TapTimerObservable, TapStaticObservable } from '../../app/api/agent';
import { enviorment } from '../../../enviorment';
import { forkJoin, from, of, Observable, concat, combineLatest } from 'rxjs'
import { tap, mergeMap, concatAll, combineAll, concatMap } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax';
import { ITapTimer } from '../../app/models/tap-timer.model';
import LoaderBar from '../../app/common/LoaderBar';
import TapListItem from './TapListItem';
import { ITapStatic } from '../../app/models/tap-static.model';


interface IProps
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

    afterUpdateTap(tap: ITap) {

    }

    getTimers(): Observable<ITapTimer[]> {
        const taps = this.props.taps as ITap[];
        return ajax.getJSON(`${enviorment.baseUrl}/${endPoints.tapRounds}?tap_id=${taps.map((tap) => tap.id).join(',')}`);
    }

    getTapStatics(): Observable<ITapStatic[]> {
        const taps = this.props.taps as ITap[];
        return ajax.getJSON(`${enviorment.baseUrl}/${endPoints.tapStatics}?tap_id=${taps.map((tap) => tap.id).join(',')}`);
    }

    getTapDetails  = () =>{
        return (forkJoin(this.getTimers(), this.getTapStatics()));
    }

    taps = this.props.taps as ITap[];

    componentDidUpdate(prevProps: IProps) {
        if(prevProps.taps?.length != this.props.taps?.length) {
            this.taps = this.props.taps as ITap[];
            this.setState({ subscribed: false });
            this.tapListItems = [];
            this.getTapListItems();
        }
    }


    tapListItems: any[]  = [];
    getTapListItems() {
        this.getTapDetails().subscribe((res) => {
            for(let i=0; i<this.taps.length; i++)
            {
                const tap = this.taps[i];
                const tapTimers = res[0].filter((timer) => timer.tap_id == tap.id);
                const tapStatics = res[1].filter((stat) => stat.taps_id == tap.id);
                this.tapListItems.push(<TapListItem key={i} tapTimers={tapTimers} tapStatics={tapStatics} tap={tap}/>)
            }
            this.setState({
                subscribed: true,
            });
        });
    }



    componentDidMount()
    {
        // this.getTimers().subscribe((res) => { console.log(res)})
        this.getTapListItems();
    }

    render() {
        return (
            this.state.subscribed ? this.tapListItems : <LoaderBar/>
        );
    }
}

export default Taps;
