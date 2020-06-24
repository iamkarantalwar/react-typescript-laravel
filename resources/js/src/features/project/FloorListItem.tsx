import React, { Component } from 'react';
import { IProject } from '../../app/models/project.model';

interface State {

}

interface Props {
    project?: IProject | null;
}

class FloorListItem extends Component<Props, State> {
    static defaultProps: Props = {
       project: null
    }

    render() {

        const { project } = this.props;

        return (
            <div>
                <div className="card-header collapsed mb-2" data-toggle="collapse" data-target='collapseOne'>
                    <a className="card-title">
                       {project?.project_name}
                    </a>
                </div>
                <div id="collapseOne" className="card-body collapse" data-parent="#accordion" >
                    <p>
                        {project?.description}
                    </p>
                </div>     
                
            </div>
        );
    }
}

export default FloorListItem;
