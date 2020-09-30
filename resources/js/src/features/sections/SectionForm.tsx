import React, { PureComponent } from 'react';
import { Section } from '../../app/api/agent';
import LoaderBar from '../../app/common/LoaderBar';
import { ISectionForm } from '../../app/form/section.form';
import { IProjectFloor } from '../../app/models/project-floor.model';

interface IProps {
    floor: IProjectFloor;
}
interface IState
{
    sectionForm: ISectionForm,
    loader: boolean,
}
class SectionForm extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            sectionForm: {
                floor_id: this.props.floor.id.toString(),
                from: "",
                quantity: "",
                section_name: "",
                to: ""
            },
            loader: false
        }
    }

    formSubmitHandler = (e: any) => {
        e.preventDefault();
        this.setState({loader: true});
        Section.addSection(this.state.sectionForm)
        .then((sections) => console.log(sections))
        .finally(() => this.setState({loader: false}));
    }

    render() {
        return (
        this.state.loader ? <LoaderBar/> :
        <div className="add-floor-tabs">
         	<form className="add-floor" onSubmit={this.formSubmitHandler}>
         		<h4 className="font-weight-normal">Add Section</h4>
         		<div className="form-group">
					<label htmlFor="exampleInputEmail1">Name</label>
                    <input
                        type="name"
                        className="form-control"
                        placeholder="Name"
                        onChange={(e) => this.setState( {sectionForm: {...this.state.sectionForm, section_name: e.target.value} } )}
                    />
			    </div>
			   <div className="add-floor-main d-flex align-items-center">
			    <div className="add-floor-number">
			    	<div className="form-group">
			    		<label htmlFor="exampleInputEmail1">Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Quantity"
                            onChange={(e) => this.setState( {sectionForm: {...this.state.sectionForm, quantity: e.target.value} } )}
                        />
			    	</div>
			    	<div className="form-group">
			    		<label htmlFor="exampleInputEmail1">Form</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Form"
                            onChange={(e) => this.setState( {sectionForm: {...this.state.sectionForm, from: e.target.value} } )}
                        />
			    	</div>
			    	<div className="form-group">
			    		<label htmlFor="exampleInputEmail1">To</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="To"
                            onChange={(e) => this.setState( {sectionForm: {...this.state.sectionForm, to: e.target.value} } )}
                        />
			    	</div>
			    </div>
			     <div className="add-floor-btns">
			    	<div className="add-floor-create-btn">
                       <input
                            type="submit"
                            className="main-btn mr-1"
                            value="Create"
                        />
			        </div>
			        <div className="add-floor-cancel">
			    	  <a href="#" className="main-btn cancel">Cancel</a>
			        </div>
			    </div>
			   </div>
         	</form>
        </div>
        );
    }
}

export default SectionForm;
