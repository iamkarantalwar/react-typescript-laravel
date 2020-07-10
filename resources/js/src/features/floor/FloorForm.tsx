import React, { Component } from 'react';
import { IProjectFloorForm } from '../../app/models/project-floor-form.model';
import LoaderBar from '../../app/common/LoaderBar';
import { ProjectFloors } from '../../app/api/agent';
import { AxiosError } from 'axios';
import { IProject } from '../../app/models/project.model';
import { IProjectFloor } from '../../app/models/project-floor.model';


interface IState {
	projectFloorForm: IProjectFloorForm;
	showLoader: boolean;
	errors: {
		name: string,
		quantity: string,
		from: string,
		to: string
	},
	message: string,
	messageClass: string,
}

interface IProps {
	project: IProject
	afterAddOfFloors: (floors :IProjectFloor[]) => void;
	toggleForm: () => void;
}

class FloorForm extends Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = this.defaultState;
	}

	defaultState = {
		projectFloorForm:{
			project_id: this.props.project.id as number,
			name: "",
			from: null,
			to: null,
			quantity: null,
		},
		errors:{
			name: "",
			quantity: "",
			from: "",
			to: ""
		},
		showLoader: false,
		message: "",
		messageClass: "",
	 }
	
	onSubmitHandler = (event: any) => {
		event.preventDefault();
		this.setState({
			errors: this.defaultState.errors
		})
		if(this.state.projectFloorForm.to != null && 
		   this.state.projectFloorForm.from != null && 
		   (this.state.projectFloorForm.to-this.state.projectFloorForm.from)+1 != this.state.projectFloorForm.quantity)
		{
			
			this.setState({
				errors: {...this.state.errors,
						quantity: `From quantity entered, Expected quantity should be ${(this.state.projectFloorForm.to-this.state.projectFloorForm.from)+1}`,
				}
			})
			return;
		}

		this.setState({
			showLoader: true,
		});
	
		ProjectFloors
		.saveProjectFloor(this.state.projectFloorForm)
		.then((res) => {
			this.setState({
				showLoader: false,
				errors: this.defaultState.errors,
				message: "Floor Created Successfully.",
				messageClass: "text-success",
			});
			this.props.afterAddOfFloors(res);
			setTimeout(()=>{ this.setState({message: "", messageClass:""}); }, 2000);
		})
		.catch((error: AxiosError) => {
			if (error.response?.status == 422) {
                let error_array = error.response?.data.errors;
                this.setState({
                    errors: {...this.state.errors,
                                name:error_array?.name != undefined ? error_array?.name[0] : "",
                                quantity:error_array?.quantity != undefined ? error_array?.quantity[0] : "",
                                from: error_array?.from != undefined ? error_array?.from[0]: "",
                                to: error_array?.to != undefined ? error_array?.to[0] : "",
                            }
                    });
                  
            } else {
				this.setState({
					message: "Something went wrong. Try again later",
					messageClass: "text-danger",
					errors: this.defaultState.errors,
				});
			}

			this.setState({showLoader: false});			
		});
	}

	componentDidUpdate(prevProps: IProps) {
		if(prevProps.project.id != this.props.project.id && this.props.project.id != undefined) {
			this.setState({projectFloorForm:{...this.state.projectFloorForm, project_id: this.props.project.id}})
		}
	}
	
    render() {
        return (
        <div className="add-floor-tabs">
			{
				this.state.showLoader ? <LoaderBar/> :

				<form className="add-floor" onSubmit={this.onSubmitHandler}>
					<h4 className="font-weight-normal">Add Floor</h4>
					<hr/>
					<div className="form-group">
						<label>Name</label>
						<input 
							type="name" 
							className={`form-control ${this.state.errors.name ? 'is-invalid': ''} ${this.state.messageClass == 'text-success' ? 'is-valid' : ''}`}
							placeholder="Name"
							onChange={(e) => this.setState({projectFloorForm:{...this.state.projectFloorForm, name: e.target.value}})}
						/>
						{ this.state.errors.name ? <span className="text-danger">{this.state.errors.name}</span> : "" }
						{ this.state.message ? <span className={this.state.messageClass}>{this.state.message}</span> : "" }
					</div>
				<div className="add-floor-main d-flex align-items-center">
					<div className="add-floor-number">
						<div className="form-group">
							<label>Quantity</label>
							<input 
								type="number" 
								className={`form-control ${this.state.errors.quantity ? 'is-invalid': ''}`} 
								placeholder="Quantity"
								onChange={(e) => this.setState({projectFloorForm:{...this.state.projectFloorForm, quantity: parseInt(e.target.value)}})}
							/>
							<span className="text-danger">{this.state.errors.quantity}</span>
						</div>
						<div className="form-group">
							<label>Form</label>
							<input 
								type="number" 
								className={`form-control ${this.state.errors.from ? 'is-invalid': ''}`} 
								placeholder="Form"
								onChange={(e) => this.setState({projectFloorForm:{...this.state.projectFloorForm, from: parseInt(e.target.value)}})}
							/>
							{ this.state.errors.from ? <span className="text-danger">{this.state.errors.from}</span> : "" }
						</div>
						<div className="form-group">
							<label>To</label>
							<input 
								type="number" 
								className={`form-control ${this.state.errors.to ? 'is-invalid': ''}`} 
								placeholder="To"
								onChange={(e) => this.setState({projectFloorForm:{...this.state.projectFloorForm, to: parseInt(e.target.value)}})}
							/>
							{ this.state.errors.to ? <span className="text-danger">{this.state.errors.to}</span> : "" }
						</div>
					</div>
					<div className="add-floor-btns">
						<div className="add-floor-create-btn">
							<button type="submit" className="main-btn mr-1">Create</button>
						</div>
						<div className="add-floor-cancel">
							<button type="reset" className="main-btn cancel" onClick={(e) => this.props.toggleForm()}>Cancel</button>
						</div>
					</div>
				</div>
				</form>
			}
        </div>
        );
    }
}

export default FloorForm;
