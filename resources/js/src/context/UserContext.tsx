import React, {Context} from 'react';

const userObject = {token: localStorage.getItem('token'), role: localStorage.getItem('role')};

const UserContext = React.createContext(userObject);

const UserProvider = UserContext.Provider;

const UserConsumer = UserContext.Consumer;

export { UserConsumer, UserProvider, UserContext, userObject };
