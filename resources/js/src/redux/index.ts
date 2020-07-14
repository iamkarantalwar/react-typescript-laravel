import rootReducer from './rootReducer';

export { fetchUsers } from './user/userAction';
export { changeTitle } from './web-title/webTitleAction';
export { fetchRooms } from './rooms/roomsAction';
export { editProjectForm } from './project/projectAction';
export { fetchProjectSettings } from './project-settings/projectSettingsAction';

export type RootState = ReturnType<typeof rootReducer>;