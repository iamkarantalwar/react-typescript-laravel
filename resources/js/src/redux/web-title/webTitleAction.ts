import { CHANGE_TITLE } from "./webTitleType"

export const changeTitle = (title: string | null) => {
    return {
        type: CHANGE_TITLE,
        payload: title
    }
}