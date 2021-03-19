import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card, Button, Popover, Avatar, Modal, List, Comment } from 'antd';
import { RetweetOutlined, HeartOutlined, MessageOutlined, EllipsisOutlined, HeartFilled, UserOutlined } from '@ant-design/icons';
import moment from 'moment';

import { PostCardWrapper } from './styles';
import PostCardContent from '../content/PostCardContent';
import FollowButton from '../button/FollowButton';
import CommentForm from '../form/CommentForm';
import PostForm from '../form/PostForm';
import CommentsList from '../list/CommentsList';
import {
  REMOVE_POST_REQUEST,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  RETWEET_POST_REQUEST,
  LOAD_POST_REQUEST,
  UPDATE_IMAGES,
  SHOW_IMAGES_PREVIEW
} from '../../reducers/post';
import { backURL } from '../../config/config';

// moment 라이브러리 한국 기준 초기화
moment.locale('ko');

const PostCard = ({
  post,
  commentOpened = false,
  addCommentDone = false,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const id = useSelector((state) => state.user.myInfo?.id);
  const { removePostLoading } = useSelector((state) => state.postReducer);

  const orderedComments = [...post.Comments].reverse();
  const liked = post.Likers.find((v) => v.id === id);
  const retweeted = post.RetweetId && post.Retweet && (post.UserId === id);
  const profileSrc = post.User.Profile?.profileSrc;
  const retweetProfileSrc = post.Retweet?.User.Profile?.profileSrc;
  const [visible, setVisible] = useState(false);
  const [postVisible, setPostVisible] = useState(false);

  const showModal = useCallback((e) => {
    e.stopPropagation();

    setVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const showPostModal = useCallback((e) => {
    e.stopPropagation();

    setPostVisible(true);

    dispatch({
      type: UPDATE_IMAGES,
      data: post.Images.map((v) => v.src),
    });
    dispatch({
      type: SHOW_IMAGES_PREVIEW,
      data: false,
    });
  }, [post, dispatch]);

  const handlePostCancel = useCallback(() => {
    setPostVisible(false);
  }, []);

  const onLike = useCallback((e) => {
    e.stopPropagation();

    if (!id) {
      return alert('로그인이 필요합니다.');
    }

    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id, post, dispatch]);

  const onUnlike = useCallback((e) => {
    e.stopPropagation();

    if (!id) {
      return alert('로그인이 필요합니다.');
    }

    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
      // userId는 백엔드에서 req.user 사용하면 됨
    });
  }, [id, post, dispatch]);

  const onRemovePost = useCallback((e) => {
    e.stopPropagation();

    if (!id) {
      return alert('로그인이 필요합니다.');
    }

    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
    if (router.pathname === `/post/[id]`) {
      router.back();
    }
  }, [id, post, dispatch]);

  const onRetweet = useCallback((e) => {
    e.stopPropagation();

    if (!id) {
      return alert('로그인이 필요합니다.');
    }

    if (id === post.UserId || id === post.Retweet?.User.id) {
      return alert('본인 게시물은 리포스트 할 수 없습니다.');
    }

    dispatch({
      type: RETWEET_POST_REQUEST,
      data: post.id,
    });
  }, [id, post, dispatch]);

  const onPreventClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const onClickPost = useCallback((e) => {
    e.stopPropagation();

    dispatch({
      type: LOAD_POST_REQUEST,
      data: post.id,
    });
  }, [dispatch, post.id]);

  return (
    <PostCardWrapper commentLength={post.Comments.length} liked={liked}>
      <Card
        title={post.RetweetId
          ? (
            <>
              <RetweetOutlined /> {post.User.nickname} 님이 리포스트 했습니다.
            </>
          )
          : null}
        actions={[
          <MessageOutlined
            aria-label="댓글"
            key="comment"
            data-length={post.Comments.length > 0 ? post.Comments.length : ''}
            onClick={showModal}
          />,
          (liked)
            ? <HeartFilled aria-label="좋아요 취소" key="unHeart" onClick={onUnlike} data-length={post.Likers.length > 0 ? post.Likers.length : ''} />
            : <HeartOutlined aria-label="좋아요" key="heart" onClick={onLike} data-length={post.Likers.length > 0 ? post.Likers.length : ''} />,
          (retweeted)
            ? <RetweetOutlined aria-label="리포스트 취소" key="unRetweet" onClick={onRemovePost} />
            : <RetweetOutlined aria-label="리포스트" key="retweet" onClick={onRetweet} />,
          <Popover
            aria-label="더 보기"
            key="more"
            placement="topLeft"
            content={
              ((id && id === post.User.id) && !(post.RetweetId && post.Retweet))
                // 리포스트 아닌 자신의 글인 경우
                ? (
                  <>
                    <div className="btn-area">
                      <Button onClick={showPostModal}>포스트 수정하기</Button>
                    </div>
                    <div className="btn-area">
                      <Button loading={removePostLoading} onClick={onRemovePost}>포스트 삭제하기</Button>
                    </div>
                  </>
                )
                // 자신의 글이 아닌 경우
                : <FollowButton
                  userInfo={
                    post.RetweetId && post.Retweet
                      ? post.Retweet.User
                      : post.User
                  }
                  postCard={true}
                />
            }
          >
            <EllipsisOutlined onClick={onPreventClick} />
          </Popover>,
        ]}
        onClick={onClickPost}
      >
        {/* 리포스트 게시글인 경우 */}
        {
          post.RetweetId && post.Retweet
            ? (
              <>
                <Card.Meta
                  title={(
                    <Link href={`/user/${post.Retweet.User.id}`}>
                      <a onClick={onPreventClick}>{post.Retweet.User.nickname}</a>
                    </Link>
                  )}
                  description={(
                    <>
                      @{post.Retweet.User.email.split('@')[0]}
                      <span>{moment(post.createdAt).format('YYYY.MM.DD')}</span>
                    </>
                  )}
                  avatar={(
                    <Link href={`/user/${post.Retweet.User.id}`}>
                      <a onClick={onPreventClick}>
                        <Avatar
                          size={40}
                          {...(retweetProfileSrc
                            ? { src: `${backURL}/profile/${retweetProfileSrc}` }
                            : { icon: <UserOutlined /> })}
                        />
                      </a>
                    </Link>
                  )}
                />
                <PostCardContent post={post} commentOpened={commentOpened} />
              </>
            )
            // 일반 게시글인 경우
            : (
              <>
                <Card.Meta
                  title={(
                    <Link href={`/user/${post.User.id}`}>
                      <a onClick={onPreventClick}>{post.User.nickname}</a>
                    </Link>
                  )}
                  description={(
                    <>
                      @{post.User.email.split('@')[0]}
                      <span>{moment(post.createdAt).format('YYYY.MM.DD')}</span>
                    </>
                  )}
                  avatar={(
                    <Link href={`/user/${post.User.id}`}>
                      <a onClick={onPreventClick}>
                        <Avatar
                          size={40}
                          {...(profileSrc
                            ? { src: `${backURL}/profile/${profileSrc}` }
                            : { icon: <UserOutlined /> })}
                        />
                      </a>
                    </Link>
                  )}
                />
                <PostCardContent post={post} commentOpened={commentOpened} />
              </>
            )
        }
      </Card>
      {
        // 코멘트 부분 -> '/post/[id]' 인입 시 표시
        commentOpened
        &&
        <CommentsList orderedComments={orderedComments} />
      }
      <Modal
        title="댓글 남기기"
        visible={visible}
        onCancel={handleCancel}
      >
        <CommentForm post={post} handleCancel={handleCancel} addCommentDone={addCommentDone} />
      </Modal>
      <Modal
        title="포스트 수정하기"
        visible={postVisible}
        onCancel={handlePostCancel}
      >
        <PostForm handlePostCancel={handlePostCancel} popup post={post} />
      </Modal>
    </PostCardWrapper >
  );
};

PostCard.proptypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isrequired,
  commentOpened: PropTypes.bool,
  addCommentDone: PropTypes.bool,
};

export default PostCard;
