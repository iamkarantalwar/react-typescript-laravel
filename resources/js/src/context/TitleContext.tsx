import React, {Context} from 'react';

export type titleContextType = {title: string, changeTitle:(title: string|any)=>void};

const titleContextObject : titleContextType = {
    title: "Title", 
    changeTitle: (title: string | null) => {},
}

const TitleContext = React.createContext(titleContextObject);

// const TitleProvider = TitleContext.Provider;

// const TitleConsumer = TitleContext.Consumer;

export { TitleContext };