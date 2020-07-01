import React, {Context} from 'react';
import { Project } from '../app/api/agent';

const ProjectContext = React.createContext(Project.getProjects());

const ProjectProvider = ProjectContext.Provider;

const ProjectConsumer = ProjectContext.Consumer;

export { ProjectConsumer, ProjectProvider, ProjectContext };