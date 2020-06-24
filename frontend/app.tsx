
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

// require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

// require('./components/App');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';

interface TypeScriptComponentProps {

}

function handleClick() {
  console.log('Hello World');
}

class App extends React.Component<TypeScriptComponentProps, {}> {
    render() {
        return (<Button>Hello</Button>)
    }
}


ReactDOM.render(
  <App />,
  document.getElementById('app') as HTMLElement
);