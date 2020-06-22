import React from 'react';
import ProjectForm from './ProjectForm/ProjectForm';
function Projects() {
    return (
        <div className="container">
            <ProjectForm/>
            <div className="floors-tabbs">
                <div className="col-md-12">
                <div id="accordion" className="accordion">
                    <h4 className="floors-tittle font-weight-normal">Floors</h4>
                    <div className="card mb-0 border-0">
                        <div className="card-header collapsed mb-2" data-toggle="collapse" href="#collapseOne">
                        <a className="card-title">
                            Projects 1
                        </a>
                        </div>
                        <div id="collapseOne" className="card-body collapse" data-parent="#accordion" >
                            <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                                aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat
                                craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                            </p>
                        </div>
                        <div className="card-header collapsed mb-2" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">
                            <a className="card-title">
                                Projects 2
                            </a>
                        </div>
                        <div id="collapseTwo" className="card-body collapse" data-parent="#accordion" >
                        <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                            aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat
                            craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                        </p>
                    </div>                   
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

export default Projects;