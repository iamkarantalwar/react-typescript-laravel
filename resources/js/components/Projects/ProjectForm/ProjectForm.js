import React, {useState, useEffect} from 'react';
import {enviorment} from '../../../enviorment';
import {Form} from 'react-bootstrap';
function ProjectForm() {
    //Declare State Of The Button 
    const [btnText, setBtnTxt]                        = useState("Add Project");
    const [showDescriptionBox, setShowDescriptionBox] = useState(false); 
    
    // Declare State of the Project Name In Form
    const [projectName, setProjectName]  = useState("");

    // Declare State of the Description In Form
    const [description, setDescription]  = useState("");

    //Defination of error messages
    const [errorMessages, setErrorMessages] = useState({
        projectName  : "",
        description  : "",
    });

    //Define States of all the projects.
    const [projects, setProjects] = useState([]);

    //Check if the Project Name is not Empty then show the Description Box
    const addProject = () => {
            if(btnText == "Add Project") {
                //Check That Project Name is not Empty
                if(projectName == "") {
                    setErrorMessages({
                        projectName : "Enter The Project Name Here"
                    });
                } else {
                    setShowDescriptionBox(true);
                    setBtnTxt("Create Project");
                }
            } else {
                if(description == "") {
                    setErrorMessages({
                        description : "Enter The Project Description Here"
                    });
                } else {
                    axios.post(`${enviorment.baseUrl}/project`)
                        .then((res) => alert("Project Added"));

                }
            }            
    }


    useEffect(() => {
        //Fetch all the project list items
        axios.get(`${enviorment.baseUrl}/project`)
        .then((res) => setProjects(res.data))
        }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        
    }

    return(
        <div className="start-form">
            <form>
                <div className="col-md-12 mt-4">
                    <div className="row align-items-center">
                        <div className="col-md-9 col-lg-10">
                            <div className="form-group">
                                <label>Projects Name</label>
                                <input type="name" 
                                       className="form-control" 
                                       placeholder="Projects Name" 
                                       id="first-name"
                                       onChange={(e)=>setProjectName(e.target.value)}/>
                            </div>
                            <Form.Text  className={errorMessages.projectName ? 'text-danger' : 'text-muted'}>
                                    {errorMessages.projectName ? errorMessages.projectName : "Enter Project Name Here" }
                            </Form.Text>
                        </div>
                        <div className="col-md-3 col-lg-2">
                            <div className="form-btn text-right mt-3">
                                <a href="#" className="main-btn" onClick={addProject}>{btnText}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div >
                    <div className={`form-group ${showDescriptionBox ? 'd-block' : 'd-none'}`}>
                    <label>Example textarea</label>
                    <textarea className="form-control" 
                                placeholder="Enter Project Description"
                                onChange={(e)=>setDescription(e.target.value)}></textarea>
                    </div>
                </div>  
            </form>
        </div>
    );
}

export default ProjectForm;