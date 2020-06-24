import React, { Component } from 'react';
import { IProject } from '../../app/models/project.model';


interface IProps {
    showDescription: boolean;
    toggleDescriptionAndTabs: () => void
} 

// let projectObject :IProject = {project_name:string, description:string};

interface IState {
    btnText: string;
    project:IProject;
}

export class ProjectForm extends Component<IProps, IState> {
    constructor(props: IProps) {

        super(props)

        this.test = this.test.bind(this);

        this.state= {
            btnText: "Add Project",
            project: {
                project_name: "",
                description: "",
            },           
        }
    }

    componentDidMount() {
        
    }
    test = (event: any) =>{
        this.setState({
            // project.project_name : event.target.value
        });
      
    }

    

    onSubmitHandler = (event: any) => {
    //     console.log(typeof event);
    //    console.log(event);
    }

    render() {
        let {showDescription, toggleDescriptionAndTabs } = this.props;
        // console.log(showDescription);
        return(
        <div className="start-form">
            <form onSubmit={this.onSubmitHandler.bind(this)}>
                <div className="col-md-12 mt-4">
                    <div className="row align-items-center">
                        <div className="col-md-9 col-lg-9 col-xl-10">
                            <div className="form-group">
                                <label>Projects Name</label>
                                <input type="name" className="form-control" 
                                                   placeholder="Projects Name" 
                                                   id="first-name"
                                                   value={this.state.project.project_name}
                                                   onChange={this.test}/>
                            </div>
                        </div>
                        <div className="col-md-3 col-lg-3 col-xl-2">
                            <div className="form-btn text-right mt-3">
                                <a href="#" type='submit' className="main-btn" onClick={() => 
                                {
                                    this.setState({btnText: "Create Project"});
                                   toggleDescriptionAndTabs();
                                }}>{this.state.btnText}</a>
                            </div>
                        </div>
                    </div>
                    <div className={`form-group ${showDescription ? 'd-block' : 'd-none'}`}>
                        <label>Example textarea</label>
                        <textarea className="form-control" placeholder="Hire sollte ein Text zur.." id="exampleFormControlTextarea1" rows={3}></textarea>
                    </div>
                </div>
            </form>
        </div>
       
          );
    }
}

export default ProjectForm;
