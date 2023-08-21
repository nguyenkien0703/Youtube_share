export const httpErrors = {
    //username not exits
    USER_NAME_NOT_FOUND: {
        message: 'User with username not found. Please try again',
        code: 'USER_01',
    },
    // user's PASSWORD   is not correct 
    USER_PASSWORD_NOT_CORRECT: {
        message: 'Password of user entered is not correct. Please try again',
        code: 'USER_02',
    },
    //video/
    //can't create video
    CANNOT_CREATE_VIDEO: {
        message: 'Can not create video. Please try again',
        code: 'VIDEO_01',
    },
    VIDEO_WITH_ID_NOT_EXIST: {
        message: 'video with videoId not exist. Please try again',
        code: 'VIDEO_02',
    },

    // token
    REQUEST_WITH_TOKEN_INVALID_OR_EXPIRED: {
        message: 'Invalid or expired token when you send request. Please try again',
        code: 'TOKEN_01',
    },

}