import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {Form, Button, Col, Row} from 'react-bootstrap';
import axios from 'axios';
import {enviorment} from '../../enviorment';


function AddProject() {

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
    
    
    return (
        <div className="card">           
            <div className="card-body">          
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={8}>
                            <Form.Group>
                                <Form.Label>Project Name</Form.Label>
                                <Form.Control type="text" placeholder="Project Name" 
                                              name="project_name"
                                              onChange={(e)=>setProjectName(e.target.value)}/>                               
                                <Form.Text  className={errorMessages.projectName ? 'text-danger' : 'text-muted'}>
                                    {errorMessages.projectName ? errorMessages.projectName : "Enter Project Name Here" }
                                </Form.Text>                            
                                
                            </Form.Group>
                        </Col> 
                        <Col md={4}>
                            <Form.Group>                               
                                <Button type={btnText == "Add Project" ? 'button' : 'submit'} className="btn btn-success mt-4"
                                        onClick={addProject}>{btnText}</Button>
                            </Form.Group>
                        </Col>
                    </Row>    
                    <Row className={showDescriptionBox ? 'd-block' : 'd-none'}>
                        <Col md={8}>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows="3" 
                                              placeholder="Enter Project Description"
                                              onChange={(e)=>setDescription(e.target.value)} />
                                <Form.Text  className={errorMessages.description ? 'text-danger' : 'text-muted'}>
                                    {errorMessages.description ? errorMessages.description : "Enter Project Description Here" }
                                </Form.Text> 
                            </Form.Group> 
                        </Col>
                    </Row>                 
                </Form>                
            </div>
            {projects.map((project) => <ProjectListItem project={project}/>)}
        </div>        
    );
}

export default AddProject;

