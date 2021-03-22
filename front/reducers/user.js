import produce from '../utils/produce';

// [Action Type(Name)]
export const LOAD_MY_INFO_REQUEST = 'LOAD_MY_INFO_REQUEST';
export const LOAD_MY_INFO_SUCCESS = 'LOAD_MY_INFO_SUCCESS';
export const LOAD_MY_INFO_FAILURE = 'LOAD_MY_INFO_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

export const UPLOAD_PROFILE_IMAGE_REQUEST = 'UPLOAD_PROFILE_IMAGE_REQUEST';
export const UPLOAD_PROFILE_IMAGE_SUCCESS = 'UPLOAD_PROFILE_IMAGE_SUCCESS';
export const UPLOAD_PROFILE_IMAGE_FAILURE = 'UPLOAD_PROFILE_IMAGE_FAILURE';

export const UPLOAD_COVER_IMAGE_REQUEST = 'UPLOAD_COVER_IMAGE_REQUEST';
export const UPLOAD_COVER_IMAGE_SUCCESS = 'UPLOAD_COVER_IMAGE_SUCCESS';
export const UPLOAD_COVER_IMAGE_FAILURE = 'UPLOAD_COVER_IMAGE_FAILURE';

// [Initial State]
export const initialState = {
  loadMyInfoLoading: false,
  loadMyInfoDone: false,
  loadMyInfoErr: null,
  loadUserLoading: false,
  loadUserDone: false,
  loadUserErr: null,
  loadFollowingsLoading: false,
  loadFollowingsDone: false,
  loadFollowingsErr: null,
  loadFollowersLoading: false,
  loadFollowersDone: false,
  loadFollowersErr: null,
  isLoggingIn: false,
  isLoggedIn: false,
  logInErr: null,
  isLoggingOut: false,
  isLoggedOut: false,
  logOutErr: null,
  isSigningUp: false,
  isSignedUp: false,
  signUpErr: null,
  isChangingNickname: false,
  isChangedNickname: false,
  changeNicknameErr: null,
  followLoading: false,
  followDone: false,
  followErr: null,
  unfollowLoading: false,
  unfollowDone: false,
  unfollowErr: null,
  removeFollowerLoading: false,
  removeFollowerDone: false,
  removeFollowerErr: null,
  uploadProfileImageLoading: false,
  uploadProfileImageDone: false,
  uploadProfileImageError: null,
  uploadCoverImageLoading: false,
  uploadCoverImageDone: false,
  uploadCoverImageError: null,
  myInfo: null,
  userInfo: null,
};

// [Reducer]
const user = (state = initialState, action) => (
  produce(state, (draft) => {
    switch (action.type) {
      case LOAD_MY_INFO_REQUEST: {
        draft.loadMyInfoLoading = true;
        draft.loadMyInfoDone = false;
        draft.loadMyInfoErr = null;
        break;
      }
      case LOAD_MY_INFO_SUCCESS: {
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoDone = true;
        draft.myInfo = action.data;
        break;
      }
      case LOAD_MY_INFO_FAILURE: {
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoErr = action.error;
        break;
      }

      case LOAD_USER_REQUEST: {
        draft.loadUserLoading = true;
        draft.loadUserDone = false;
        draft.loadUserErr = null;
        break;
      }
      case LOAD_USER_SUCCESS: {
        draft.loadUserLoading = false;
        draft.loadUserDone = true;
        draft.userInfo = action.data;
        break;
      }
      case LOAD_USER_FAILURE: {
        draft.loadUserLoading = false;
        draft.loadUserErr = action.error;
        break;
      }

      case LOAD_FOLLOWINGS_REQUEST: {
        draft.loadFollowingsLoading = true;
        draft.loadFollowingsDone = false;
        draft.loadFollowingsErr = null;
        break;
      }
      case LOAD_FOLLOWINGS_SUCCESS: {
        draft.myInfo.Followings = action.data;
        draft.loadFollowingsLoading = false;
        draft.loadFollowingsDone = true;
        break;
      }
      case LOAD_FOLLOWINGS_FAILURE: {
        draft.loadFollowingsLoading = false;
        draft.loadFollowingsErr = action.error;
        break;
      }

      case LOAD_FOLLOWERS_REQUEST: {
        draft.loadFllowersLoading = true;
        draft.loadFllowersDone = false;
        draft.loadFllowersErr = null;
        break;
      }
      case LOAD_FOLLOWERS_SUCCESS: {
        draft.myInfo.Followers = action.data;
        draft.loadFllowersLoading = false;
        draft.loadFllowersDone = true;
        break;
      }
      case LOAD_FOLLOWERS_FAILURE: {
        draft.loadFllowersLoading = false;
        draft.loadFllowersErr = action.error;
        break;
      }

      case FOLLOW_REQUEST: {
        draft.followLoading = true;
        draft.followDone = false;
        draft.followErr = null;
        break;
      }
      case FOLLOW_SUCCESS: {
        draft.myInfo.Followings.push({ id: action.data.UserId });
        draft.followLoading = false;
        draft.followDone = true;
        break;
      }
      case FOLLOW_FAILURE: {
        draft.followLoading = false;
        draft.followErr = action.error;
        break;
      }

      case UNFOLLOW_REQUEST: {
        draft.unfollowLoading = true;
        draft.unfollowDone = false;
        draft.unfollowErr = null;
        break;
      }
      case UNFOLLOW_SUCCESS: {
        draft.myInfo.Followings = draft.myInfo.Followings.filter((v) => v.id !== action.data.UserId);
        draft.unfollowLoading = false;
        draft.unfollowDone = true;
        break;
      }
      case UNFOLLOW_FAILURE: {
        draft.unfollowLoading = false;
        draft.unfollowErr = action.error;
        break;
      }

      case REMOVE_FOLLOWER_REQUEST: {
        draft.removeFollowerLoading = true;
        draft.removeFollowerDone = false;
        draft.removeFollowerErr = null;
        break;
      }
      case REMOVE_FOLLOWER_SUCCESS: {
        draft.myInfo.Followers = draft.myInfo.Followers.filter((v) => v.id !== action.data.UserId);
        draft.removeFollowerLoading = false;
        draft.removeFollowerDone = true;
        break;
      }
      case REMOVE_FOLLOWER_FAILURE: {
        draft.removeFollowerLoading = false;
        draft.removeFollowerErr = action.error;
        break;
      }

      case LOG_IN_REQUEST: {
        draft.isLoggingIn = true;
        draft.isLoggedIn = false;
        draft.logInErr = null;
        break;
      }
      case LOG_IN_SUCCESS: {
        draft.isLoggingIn = false;
        draft.isLoggedIn = true;
        draft.isLoggedOut = false;
        draft.myInfo = action.data;
        break;
      }
      case LOG_IN_FAILURE: {
        draft.isLoggingIn = false;
        draft.logInErr = action.error;
        break;
      }

      case LOG_OUT_REQUEST:
        draft.isLoggingOut = true;
        draft.isLoggedOut = false;
        draft.logOutErr = null;
        break;
      case LOG_OUT_SUCCESS:
        draft.isLoggingOut = false;
        draft.isLoggedOut = true;
        draft.isLoggedIn = false;
        draft.myInfo = null;
        break;
      case LOG_OUT_FAILURE:
        draft.isLoggingOut = false;
        draft.logOutErr = action.error;
        break;

      case SIGN_UP_REQUEST:
        draft.isSigningUp = true;
        draft.isSignedUp = false;
        draft.signUpErr = null;
        break;
      case SIGN_UP_SUCCESS:
        draft.isSigningUp = false;
        draft.isSignedUp = true;
        break;
      case SIGN_UP_FAILURE:
        draft.isSigningUp = false;
        draft.signUpErr = action.error;
        break;

      case CHANGE_NICKNAME_REQUEST:
        draft.isChangingNickname = true;
        draft.isChangedNickname = false;
        draft.changeNicknameErrErr = null;
        break;
      case CHANGE_NICKNAME_SUCCESS:
        draft.myInfo.nickname = action.data.nickname;
        draft.isChangingNickname = false;
        draft.isChangedNickname = true;
        break;
      case CHANGE_NICKNAME_FAILURE:
        draft.isChangingNickname = false;
        draft.changeNicknameErr = action.error;
        break;

      case ADD_POST_TO_ME:
        draft.myInfo.Posts.unshift({ id: action.data });
        break;

      case REMOVE_POST_OF_ME: {
        draft.myInfo.Posts = draft.myInfo.Posts.filter((v) => v.id !== action.data);
        break;
      }

      case UPLOAD_PROFILE_IMAGE_REQUEST: {
        draft.uploadProfileImageLoading = true;
        draft.uploadProfileImageDone = false;
        draft.uploadProfileImageError = null;
        // draft.userInfo.Profile = {};
        // draft.myInfo.Profile = {};
        break;
      }
      case UPLOAD_PROFILE_IMAGE_SUCCESS: {
        draft.userInfo.Profile.profileSrc = action.data.profileSrc;
        draft.myInfo.Profile.profileSrc = action.data.profileSrc;
        draft.uploadProfileImageDone = true;
        draft.uploadProfileImageLoading = false;
        break;
      }
      case UPLOAD_PROFILE_IMAGE_FAILURE: {
        draft.uploadProfileImageLoading = false;
        draft.uploadProfileImageError = action.error;
        break;
      }

      case UPLOAD_COVER_IMAGE_REQUEST: {
        draft.uploadCoverImageLoading = true;
        draft.uploadCoverImageDone = false;
        draft.uploadCoverImageError = null;
        // draft.userInfo.Profile = {};
        // draft.myInfo.Profile = {};
        break;
      }
      case UPLOAD_COVER_IMAGE_SUCCESS: {
        draft.userInfo.Profile.coverSrc = action.data.coverSrc;
        draft.myInfo.Profile.coverSrc = action.data.coverSrc;
        draft.uploadCoverImageDone = true;
        draft.uploadCoverImageLoading = false;
        break;
      }
      case UPLOAD_COVER_IMAGE_FAILURE: {
        draft.uploadCoverImageLoading = false;
        draft.uploadCoverImageError = action.error;
        break;
      }
      default:
        break;
    }
  })
);

export default user;
