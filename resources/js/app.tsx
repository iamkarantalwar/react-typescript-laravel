import React from 'react';
import ReactDOM from 'react-dom';
import {Header} from './src/app/layout/Header';
import Projects from './src/features/project/Projects';

export default class App extends React.Component{
  render(): any{
     return(
        <Projects/>
     );
  }
}

ReactDOM.render(<App/>,document.getElementById('root'));