import React, { Component, ChangeEvent } from 'react';
import { IRoomType } from '../../app/models/room-type';
import { RoomType, FloorRooms } from '../../app/api/agent';
import { AxiosError } from 'axios';
import { IRoomForm, RoomDetails } from '../../app/models/room-form.model';
import { IProjectFloor } from '../../app/models/project-floor.model';
import LoaderBar from '../../app/common/LoaderBar';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface IProps extends RouteComponentProps {
    floor: IProjectFloor;
    hideRoomForm: () => void;
}

interface IState {
    roomTypes: IRoomType[];
    roomForm: IRoomForm;
    errors: {
        from: string,
        to: string,
        name: string,
        quantity: string,
    };
    showLoader: boolean;
    message: string;
    messageClass: string;
}

class RoomForm extends Component<IProps, IState> {
    defaultState: IState = {
        roomTypes: [],
        roomForm:{
            floor_id: '',
            from: '',
            to: '',
            name: '',
            quantity: '',
            room_details:[],
        },
        errors:{
            from: '',
            to: '',
            name: '',
            quantity: '',
        },
        showLoader: false,
        message: '',
        messageClass: '',
    }

    constructor(props: IProps) {
        super(props);
        this.state=this.defaultState;
    }

    componentDidMount() {

        this.setState({
            showLoader: true,
        });

        RoomType
        .getRoomTypes()
        .then((res) => {
            let roomDetails = res.map((room :IRoomType) : RoomDetails => {
                return {room_type: room, quantity: ""};
            })
            this.setState({
                roomTypes: res,
                roomForm: {
                            ...this.state.roomForm, 
                            room_details: roomDetails, 
                            floor_id: this.props.floor.id.toString()
                },
            });
            this.defaultState.roomForm.room_details = roomDetails;
        })
        .catch((error: AxiosError) => {

        })
        .finally(()=> {
            this.setState({
                showLoader: false,
            })
        })
    }

    roomTypeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, room: IRoomType) => {
        let room_details: RoomDetails[] = this.state.roomForm.room_details.map((type)=>{
                if(type.room_type == room)
                {
                    type.quantity = event.target.value;
                }
                return type;
        });
        
        this.setState({
            roomForm: {...this.state.roomForm,room_details: room_details}
        });
    } 

    submitHandler = (event: any) => {
        event.preventDefault();

        this.setState({
            errors: this.defaultState.errors,
            showLoader: true,
        });

        FloorRooms
        .saveFloorRooms(this.state.roomForm)
        .then((res) => {
            let room_details = this.state.roomForm.room_details;
            this.setState({
                message: "Room Created Successfully",
                messageClass: 'text-success',
                roomForm: this.defaultState.roomForm,
            });
            setTimeout(()=>{ this.setState({message: '', messageClass: ''}); 
                             this.props.hideRoomForm(); 
                            }, 
                            2000);
            
        })
        .catch((error: AxiosError) => {
            let error_array = error.response?.data.errors;
            this.setState({
                errors: {...this.state.errors,
                            name:error_array?.name != undefined ? error_array?.name[0] : "",
                            quantity:error_array?.quantity != undefined ? error_array?.quantity[0] : "",
                            from: error_array?.from != undefined ? error_array?.from[0]: "",
                            to: error_array?.to != undefined ? error_array?.to[0] : "",
                           
                        },
                        message: error_array?.room_details != undefined && error_array?.quantity == undefined ? error_array?.room_details[0] : "Check the fields.",
                        messageClass: 'text-danger'
                });
                
        })
        .finally(()=>{
            this.setState({
                showLoader: false
            }); 
           
        })
    }
    
    render() {
        let column:any = [];
        let row:any  =[];
        let i=0;
        this.state.roomTypes.forEach((type, index) => {
            if(column!= null && column!=undefined ) {
                if((index+1)%4==0)
                {
                    row.push(<div key={i} className="room-quantity d-flex justify-content-between">
                                    {column}
                                </div>);  
                    column = [];                                  
                } else {
                    column.push(
                        <div key={i} className="form-group">
                            <label htmlFor="exampleInputEmail1">{type.room_type}</label>
                            <input type="number" 
                                className="form-control"
                                placeholder="Quantity"
                                value={this.state.roomForm.room_details[i].quantity}
                                onChange={(e) => this.roomTypeChangeHandler(e, type)}
                            />
                        </div>
                    );
                }
                i = i+1;
            }
        })

        if(column.length>0) {
            row.push(<div key={i} className="room-quantity d-flex justify-content-between">
                                    {column}
                                </div>);  
            column = [];      
        }
        
        return (
            <div className="rooms-form-area my-5" id="room-form">
                <form className="add-rooms-form" onSubmit={this.submitHandler}>
                    <h5 className="font-weight-bold">Add Rooms to {this.props.floor.floor_name}</h5>
                    {this.state.message ? <span className={this.state.messageClass}><b>{this.state.message}</b></span> : ""}
                    <hr/>
                    <div className="add-room-details d-flex">
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Name</label>
                            <input 
                                type="name" 
                                className={`form-control ${this.state.errors.name ? 'is-invalid': ''}`} 
                                value={this.state.roomForm.name}
                                onChange={(e) => this.setState( {roomForm: {...this.state.roomForm, name: e.target.value}} )} 
                            />
                            {this.state.errors.name ? <span className='text-danger'>{this.state.errors.name}</span> : ""}
                        </div>
                        <div className="add-floor-number d-flex">
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Quantity</label>
                                <input 
                                    type="number" 
                                    className={`form-control ${this.state.errors.quantity ? 'is-invalid': ''}`} 
                                    placeholder="Quantity" 
                                    value={this.state.roomForm.quantity}
                                    onChange={(e) => this.setState( {roomForm: {...this.state.roomForm, quantity: e.target.value}} )}     
                                />
                                {this.state.errors.quantity ? <span className='text-danger'>{this.state.errors.quantity}</span> : ""}
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Form</label>
                                <input 
                                    type="number" 
                                    className={`form-control ${this.state.errors.from ? 'is-invalid': ''}`} 
                                    placeholder="From"
                                    value={this.state.roomForm.from}
                                    onChange={(e) => this.setState( {roomForm: {...this.state.roomForm, from: e.target.value}} )}     
                                />
                                {this.state.errors.from ? <span className='text-danger'>{this.state.errors.from}</span> : ""}
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">To</label>
                                <input 
                                    type="number" 
                                    className={`form-control ${this.state.errors.to ? 'is-invalid': ''}`} 
                                    placeholder="To"
                                    value={this.state.roomForm.to}
                                    onChange={(e) => this.setState( {roomForm: {...this.state.roomForm, to: e.target.value}} )} 
                                />
                                {this.state.errors.to ? <span className='text-danger'>{this.state.errors.to}</span> : ""}
                            </div>
                        </div>
                    </div>
                    <div className="room-quantity-area my-4">
                        
                        {this.state.showLoader ? <LoaderBar/> : row}
                        
                        <div className="add-rooms-btns mt-3">
                            <div className="add-floor-create-btn">
                                <button type="submit" className="main-btn mr-1">Add</button>
                            </div>
                            <div className="add-floor-cancel">
                                <button type="reset" className="main-btn cancel" onClick={(e) => this.props.hideRoomForm()}>Cancel</button>
                            </div>
                    </div>
                </div>
            </form>
      </div>   
        );
    }
}

export default withRouter(RoomForm);
