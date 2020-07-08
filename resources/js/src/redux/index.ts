import rootReducer from './rootReducer';

export { fetchUser } from './user/userAction';
export { changeTitle } from './web-title/webTitleAction';

export type RootState = ReturnType<typeof rootReducer>;