import React, { useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { END } from 'redux-saga';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import wrapper from '../../store/configureStore';
import AppLayout from '../../components/layout/AppLayout';
import PostCard from '../../components/card/PostCard';
import { LOAD_USER_POSTS_REQUEST } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from '../../reducers/user';
import ProfileCard from '../../components/card/ProfileCard';
import AppHeader from '../../components/header/AppHeader';

const User = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { myInfo, isLoggedIn, userInfo, isLoggedOut } = useSelector((state) => state.user);
  const {
    mainPosts,
    targetPost,
    hasMorePost,
    allPostsCount,
    loadPostsLoading,
    retweetPostError,
    retweetPostDone,
    loadPostDone,
    addCommentDone,
  } = useSelector((state) => state.postReducer);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 400) {
        console.log(hasMorePost, allPostsCount);
        if (hasMorePost && !loadPostsLoading) {
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            lastId: mainPosts[mainPosts.length - 1]?.id,
            data: id,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    // *** useEffect에서 이벤트처리기를 등록하면 반드시 return 문으로 event 해제를 해줘야 메모리에 쌓이지 않음
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePost, loadPostsLoading, mainPosts.length, id, dispatch]);

  useEffect(() => {
    if ((targetPost && loadPostDone && allPostsCount !== 0) || addCommentDone) {
      router.push(`/post/${targetPost.id}`).then((() => window.scrollTo(0, 0)));
    }
  }, [loadPostDone, targetPost, mainPosts]);

  useEffect(() => {
    if (isLoggedOut && !isLoggedIn && !myInfo) {
      router.push('/');
    }
  }, [isLoggedOut, isLoggedIn, myInfo]);

  return (
    <AppLayout>
      {userInfo && (
        <Head>
          <title>
            {userInfo.nickname}님의 글
          </title>
          <meta name="description" content={`${userInfo.nickname}님의 게시글`} />
          <meta property="og:title" content={`${userInfo.nickname}님의 게시글`} />
          <meta property="og:description" content={`${userInfo.nickname}님의 게시글`} />
          <meta property="og:image" content="https://nodebird.com/favicon.ico" />
          <meta property="og:url" content={`https://nodebird.com/user/${id}`} />
        </Head>
      )}
      {userInfo
        ? (
          <>
            <AppHeader title={userInfo.nickname} userInfo={userInfo} />
            <ProfileCard userInfo={userInfo} />
          </>
        )
        : null}
      {mainPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          retweetPostDone={retweetPostDone}
          retweetPostError={retweetPostError}
        />
      ))}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default User;
