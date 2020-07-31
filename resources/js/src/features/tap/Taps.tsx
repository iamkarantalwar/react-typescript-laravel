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

    getTimers(): Observable<any[]> {
        const taps = this.props.taps as ITap[];
        return combineLatest(taps.map(tap => ajax.getJSON(`${enviorment.baseUrl}/${endPoints.tapRounds}?tap_id=${tap.id}`)));
      }

      getTapStatics(): Observable<any[]> {
        const taps = this.props.taps as ITap[];
        return combineLatest(taps.map(tap => ajax.getJSON(`${enviorment.baseUrl}/${endPoints.tapStatics}?tap_id=${tap.id}`)));
      }

     getTapDetails  = () =>{

         return (combineLatest(this.getTimers(), this.getTapStatics()));
     }

     tapListItems: any[]  = [];

    componentDidMount()
    {
        // this.getTimers().subscribe((res) => { console.log(res)})

        this.getTapDetails().subscribe((res) => {
            for(let i=0; i<res[0].length; i++)
            {
                const taps = this.props.taps as ITap[];
                const tapTimers = res[0][i] as ITapTimer[];
                const tapStatics = res[1][i] as ITapStatic[];
                console.log(taps[i]);
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

export default Taps;
