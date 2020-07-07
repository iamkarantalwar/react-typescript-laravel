import React, { useContext } from 'react';
import { UserConsumer, UserContext, userObject } from '../../context/UserContext';

const Authorization = (WrappedComponent: any, roles: Array<string>) => {
    return class extends React.Component {
        
        render():any {
            if(roles.indexOf(userObject.role as string) != -1)
            {
                return <WrappedComponent/>;
            } else {
                return <div className="container"><h1 style={{textAlign: 'center'}}>Page Not Found </h1></div>
            }
        }
    }    
}

export default Authorization;
