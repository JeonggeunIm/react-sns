import produce from '../utils/produce';

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const UPDATE_POST_REQUEST = 'UPDATE_POST_REQUEST';
export const UPDATE_POST_SUCCESS = 'UPDATE_POST_SUCCESS';
export const UPDATE_POST_FAILURE = 'UPDATE_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const RETWEET_POST_REQUEST = 'RETWEET_POST_REQUEST';
export const RETWEET_POST_SUCCESS = 'RETWEET_POST_SUCCESS';
export const RETWEET_POST_FAILURE = 'RETWEET_POST_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE';
export const UPDATE_IMAGES = 'UPDATE_IMAGES';
export const SHOW_IMAGES_PREVIEW = 'SHOW_IMAGES_PREVIEW';

// export const addPost = (data) => ({
//   type: ADD_POST_REQUEST,
//   data,
// });
// export const addComment = (data) => ({
//   type: ADD_COMMENT_REQUEST,
//   data,
// });

export const initialState = {
  mainPosts: [],
  targetPost: null,
  imagePaths: [],
  allPostsCount: 0,
  hasMorePost: true,
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  updatePostLoading: false,
  updatePostDone: false,
  updatePostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
  likePostLoading: false,
  likePostDone: false,
  likePostError: null,
  unlikePostLoading: false,
  unlikePostDone: false,
  unlikePostError: null,
  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,
  retweetPostLoading: false,
  retweetPostDone: false,
  retweetPostError: null,
  showImagesPreview: false,
};

// reducer
const postReducer = (state = initialState, action) => (
  produce(state, (draft) => {
    switch (action.type) {
      case LOAD_USER_POSTS_REQUEST:
      case LOAD_HASHTAG_POSTS_REQUEST:
      case LOAD_POSTS_REQUEST: {
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;
      }
      case LOAD_USER_POSTS_SUCCESS:
      case LOAD_HASHTAG_POSTS_SUCCESS:
      case LOAD_POSTS_SUCCESS: {
        draft.allPostsCount = action.postsLength;
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.hasMorePost && (draft.mainPosts = draft.mainPosts.concat(action.data));
        draft.hasMorePost = (draft.mainPosts.length < draft.allPostsCount) && (action.data.length === 10);
        break;
      }
      case LOAD_USER_POSTS_FAILURE:
      case LOAD_HASHTAG_POSTS_FAILURE:
      case LOAD_POSTS_FAILURE: {
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.error;
        break;
      }

      case LOAD_POST_REQUEST: {
        draft.loadPostLoading = true;
        draft.loadPostDone = false;
        draft.loadPostError = null;
        break;
      }
      case LOAD_POST_SUCCESS: {
        draft.loadPostLoading = false;
        draft.loadPostDone = true;
        draft.targetPost = action.data;
        break;
      }
      case LOAD_POST_FAILURE: {
        draft.loadPostLoading = false;
        draft.loadPostError = action.error;
        break;
      }

      case LIKE_POST_REQUEST: {
        draft.likePostLoading = true;
        draft.likePostDone = false;
        draft.likePostError = null;
        break;
      }
      case LIKE_POST_SUCCESS: {
        if (draft.targetPost) {
          draft.targetPost.Likers.push({ id: action.data.UserId });
        } else {
          const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
          post.Likers.push({ id: action.data.UserId });
        }
        draft.likePostDone = true;
        draft.likePostLoading = false;
        break;
      }
      case LIKE_POST_FAILURE: {
        draft.likePostLoading = false;
        draft.likePostError = action.error;
        break;
      }

      case UNLIKE_POST_REQUEST: {
        draft.unlikePostLoading = true;
        draft.unlikePostDone = false;
        draft.unlikePostError = null;
        break;
      }
      case UNLIKE_POST_SUCCESS: {
        if (draft.targetPost) {
          draft.targetPost.Likers = draft.targetPost.Likers.filter((v) => v.id !== action.data.UserId);
        } else {
          const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
          post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId);
        }
        draft.unlikePostDone = true;
        draft.unlikePostLoading = false;
        break;
      }
      case UNLIKE_POST_FAILURE: {
        draft.unlikePostLoading = false;
        draft.unlikePostError = action.error;
        break;
      }

      case ADD_POST_REQUEST: {
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      }
      case ADD_POST_SUCCESS: {
        draft.addPostDone = true;
        draft.addPostLoading = false;
        action.data.isOwn && draft.mainPosts.unshift(action.data);
        break;
      }
      case ADD_POST_FAILURE: {
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;
      }

      case UPDATE_POST_REQUEST: {
        draft.updatePostLoading = true;
        draft.updatePostDone = false;
        draft.updatePostError = null;
        break;
      }
      case UPDATE_POST_SUCCESS: {
        if (draft.targetPost) {
          draft.targetPost.content = action.data.content;
          draft.targetPost.Images = action.data.images;
        } else {
          draft.mainPosts.find((v) => v.id === action.data.PostId).content = action.data.content;
          draft.mainPosts.find((v) => v.id === action.data.PostId).Images = action.data.images;
        }
        draft.updatePostDone = true;
        draft.updatePostLoading = false;
        break;
      }
      case UPDATE_POST_FAILURE: {
        draft.updatePostLoading = false;
        draft.updatePostError = action.error;
        break;
      }

      case REMOVE_POST_REQUEST: {
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      }
      case REMOVE_POST_SUCCESS: {
        draft.removePostDone = true;
        draft.removePostLoading = false;
        draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data.PostId);
        break;
      }
      case REMOVE_POST_FAILURE: {
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      }

      case ADD_COMMENT_REQUEST: {
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      }
      case ADD_COMMENT_SUCCESS: {
        if (draft.targetPost) {
          draft.targetPost.Comments.push(action.data);
        } else {
          // eslint-disable-next-line no-shadow
          const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
          post.Comments.unshift(action.data);
        }
        draft.addCommentDone = true;
        draft.addCommentLoading = false;
        break;
      }
      case ADD_COMMENT_FAILURE: {
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;
      }

      case UPLOAD_IMAGES_REQUEST: {
        draft.uploadImagesLoading = true;
        draft.uploadImagesDone = false;
        draft.uploadImagesError = null;
        break;
      }
      case UPLOAD_IMAGES_SUCCESS: {
        draft.imagePaths = draft.imagePaths.concat(action.data);
        draft.uploadImagesDone = true;
        draft.uploadImagesLoading = false;
        break;
      }
      case UPLOAD_IMAGES_FAILURE: {
        draft.uploadImagesLoading = false;
        draft.uploadImagesError = action.error;
        break;
      }

      case RETWEET_POST_REQUEST: {
        draft.retweetPostLoading = true;
        draft.retweetPostDone = false;
        draft.retweetPostError = null;
        break;
      }
      case RETWEET_POST_SUCCESS: {
        draft.retweetPostError = null;
        draft.mainPosts.unshift(action.data);
        draft.retweetPostDone = true;
        draft.retweetPostLoading = false;
        break;
      }
      case RETWEET_POST_FAILURE: {
        draft.retweetPostLoading = false;
        draft.retweetPostError = action.error;
        break;
      }

      case REMOVE_IMAGE: {
        draft.imagePaths = draft.imagePaths.filter((v, i) => i !== action.data);
        break;
      }

      case UPDATE_IMAGES: {
        draft.imagePaths = action.data;
        break;
      }

      case SHOW_IMAGES_PREVIEW: {
        draft.showImagesPreview = action.data;
        break;
      }

      default:
        break;
    }
  })
);

export default postReducer;
