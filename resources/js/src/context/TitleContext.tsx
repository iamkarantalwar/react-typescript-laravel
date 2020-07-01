import React, {Context} from 'react';

const TitleContext = React.createContext("Title");

const TitleProvider = TitleContext.Provider;

const TitleConsumer = TitleContext.Consumer;

export { TitleConsumer, TitleProvider, TitleContext };