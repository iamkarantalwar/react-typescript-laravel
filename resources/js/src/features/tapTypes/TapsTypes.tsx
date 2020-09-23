import React, { Component } from 'react';
import { RoomType } from '../../app/api/agent';
import LoaderBar from '../../app/common/LoaderBar';
import { IRoomType } from '../../app/models/room-type.model';
import TapTypeListItem from './TapTypeListItem';
import AddTapTypeForm from './AddTapTypeForm';

interface IState {
    roomsTypesList: IRoomType[];
    searchInput: string;
    elements: IRoomType[];
    showLoader:boolean;
}

interface IProps {}

class TapTypes extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            roomsTypesList: [],
            searchInput:"",
            elements: [],
            showLoader:false,
        }
    }

    tapTypeNameExist(type: IRoomType): boolean{
        let team_ =  this.state.roomsTypesList.find((elem) => elem.room_type == type.room_type);
        if (team_) {
            return true;
        } else {
            return false;
        }
    }

    afterAddNewTap = (tapType: IRoomType) => {
        this.setState({
            elements:[...this.state.elements, tapType],
            roomsTypesList:[...this.state.roomsTypesList, tapType]
        })
    }


    componentDidMount() {
        this.setState({showLoader:true});
        RoomType
        .getRoomTypes()
        .then((res) => {
            this.setState({roomsTypesList: res, elements:res});
            this.setState({showLoader:false});
        })
        .catch((res) =>{
            this.setState({showLoader:false});
            console.log(res)
        });
    }

    filterListItems = (event :any) => {
        let search = this.state.searchInput;
        if (search != "") {
            let elem = this.state.roomsTypesList.filter(e => e.room_type.toLowerCase().includes(search.toLowerCase()));
            this.setState({elements: elem});
        } else {
            this.setState({elements:this.state.roomsTypesList});
        }
    }

    render() {
        return (
            <div>
                <div className="start-form">
                    <div className="container">
                        <div className="main-team-area">
                            <AddTapTypeForm
                                tapTypeNameExist={this.tapTypeNameExist.bind(this)}
                                afterAddNewTap={this.afterAddNewTap.bind(this)}
                            />
                            <div className="team-search mt-5 px-4 ml-3">
                                <div className="row align-items-center justify-content-between ">
                                    <div className="add-new-team">
                                        <h5 className="font-weight-bold">Tap Types</h5>
                                    </div>

                                    <div className="team-form-btn">
                                        <form className="form-inline my-2 my-lg-0">
                                            <input className="form-control"
                                                   type="search"
                                                   placeholder="Suche..."
                                                   aria-label="Search"
                                                   onChange={(e) => this.setState({searchInput: e.target.value})}/>
                                            <button
                                                className="btn s my-2 my-sm-0"
                                                type="button"
                                                onClick={this.filterListItems.bind(this)}
                                            >
                                                <i className="fa fa-search" aria-hidden="true"></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <hr/>
                            </div>
                            {
                                this.state.showLoader ? <LoaderBar/> :
                                <div className="team-name-box">
                                    <h5 className="ml-4">Tap Type</h5>
                                    <div className="main-table table-responsive">
                                        <table className="table">

                                            <tbody>
                                                {
                                                this.state.elements
                                                .map((type) => <TapTypeListItem
                                                key={type.id}
                                                roomType={type}
                                                />)}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TapTypes;
