import React, { PureComponent } from 'react';
import { Section } from '../../app/api/agent';
import LoaderBar from '../../app/common/LoaderBar';
import { ISectionForm } from '../../app/form/section.form';
import { IProjectFloor } from '../../app/models/project-floor.model';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { ISection } from '../../app/models/section.model';

interface IProps extends WithTranslation {
    floor: IProjectFloor;
    afterAddOfSections: (sections: ISection[]) => void,
    toggleSectionsList: () => void,
}
interface IState
{
    sectionForm: ISectionForm,
    errors: ISectionForm,
    loader: boolean,
    message: string,
    messageClass: string,
}
class SectionForm extends PureComponent<IProps, IState> {
    errors = {
        floor_id: "",
        from: "",
        quantity: "",
        section_name: "",
        to: "",
    };

    sectionForm = {
        floor_id: this.props.floor.id.toString(),
        from: "",
        quantity: "",
        section_name: "",
        to: ""
    };

    constructor(props: IProps) {
        super(props);
        this.state = {
            sectionForm: this.sectionForm,
            errors:this.errors,
            loader: false,
            message: "",
            messageClass: ""
        }
    }

    formSubmitHandler = (e: any) => {
        e.preventDefault();
		this.setState({
			errors: this.errors
		})
		if(this.state.sectionForm.to != null &&
		   this.state.sectionForm.from != null &&
		   (parseInt(this.state.sectionForm.to)-parseInt(this.state.sectionForm.from))+1 != parseInt(this.state.sectionForm.quantity))
		{

			this.setState({
				errors: {...this.errors,
						quantity: this.props.t('From the specified amount quantity should be', { "quantity" : ((parseInt(this.state.sectionForm.to)-parseInt(this.state.sectionForm.from))+1) }),
				}
			})
			return;
		}

		this.setState({
			loader: true,
		});

		Section
		.addSection(this.state.sectionForm)
		.then((res) => {
			this.setState({
				sectionForm: {
						...this.sectionForm
				},
				loader: false,
				errors: this.errors,
				message: "Sections created successfully",
				messageClass: "text-success",
			});

			this.props.afterAddOfSections(res);
			//setTimeout(()=>{ this.setState({message: "", messageClass:""}); this.props.toggleForm(); }, 2000);
		})
		.catch((error: AxiosError) => {
			if (error.response?.status == 422) {
                let error_array = error.response?.data.errors;
                this.setState({
                    errors: {...this.state.errors,
                                section_name:error_array?.name != undefined ? error_array?.section_name[0] : "",
                                quantity:error_array?.quantity != undefined ? error_array?.quantity[0] : "",
                                from: error_array?.from != undefined ? error_array?.from[0]: "",
                                to: error_array?.to != undefined ? error_array?.to[0] : "",
                            }
                    });

            } else {
                console.log(error);
				this.setState({
					message: "swr",
					messageClass: "text-danger",
					errors: this.errors,
				});
			}

			this.setState({loader: false});
		});
	}

    render() {
        const t = this.props.t;
        return (
        this.state.loader ? <LoaderBar/> :
        <div className="add-floor-tabs">
         	<form className="add-floor" onSubmit={this.formSubmitHandler}>
                <h4 className="font-weight-normal">{t('Add')} {t('Sections')}</h4>
         		<div className="form-group">
					<label htmlFor="exampleInputEmail1">Name</label>
                    <input
                        type="name"
                        className="form-control"
                        placeholder="Name"
                        onChange={(e) => this.setState( {sectionForm: {...this.state.sectionForm, section_name: e.target.value} } )}
                    />
                    { this.state.errors.section_name ? <span className="text-danger">{t(this.state.errors.section_name)}</span> : "" }
					{ this.state.message ? <span className={this.state.messageClass}>{t(this.state.message)}</span> : "" }
			    </div>
			   <div className="add-floor-main d-flex align-items-center">
			    <div className="add-floor-number">
			    	<div className="form-group">
                        <label htmlFor="exampleInputEmail1">{t('Quantity')}</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder={t('Quantity')}
                            onChange={(e) => this.setState( {sectionForm: {...this.state.sectionForm, quantity: e.target.value} } )}
                        />
                        <span className="text-danger">{this.state.errors.quantity}</span>
			    	</div>
			    	<div className="form-group">
                        <label htmlFor="exampleInputEmail1">{t('From')}</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder={t('From')}
                            onChange={(e) => this.setState( {sectionForm: {...this.state.sectionForm, from: e.target.value} } )}
                        />
                        <span className="text-danger">{this.state.errors.from}</span>
			    	</div>
			    	<div className="form-group">
                        <label htmlFor="exampleInputEmail1">{t('To')}</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder={t('To')}
                            onChange={(e) => this.setState( {sectionForm: {...this.state.sectionForm, to: e.target.value} } )}
                        />
                        <span className="text-danger">{this.state.errors.to}</span>
			    	</div>
			    </div>
			     <div className="add-floor-btns">
			    	<div className="add-floor-create-btn">
                        <a href={void(0)}
                           onClick={this.formSubmitHandler}
                           className="main-btn mr-1">
                               {t('Create').toString()}
                           </a>
			        </div>
			        <div className="add-floor-cancel">
                        <a href="#" className="main-btn cancel">{t('Reset')}</a>
			        </div>
			    </div>
			   </div>
         	</form>
        </div>
        );
    }
}

export default withTranslation()(SectionForm);
