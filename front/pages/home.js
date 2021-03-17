import React, { useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { END } from 'redux-saga';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import wrapper from '../store/configureStore';
import AppLayout from '../components/layout/AppLayout';
import PostForm from '../components/form/PostForm';
import PostCard from '../components/card/PostCard';
import AppHeader from '../components/header/AppHeader';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { myInfo, isLoggedIn, isLoggedOut } = useSelector((state) => state.user);
  const {
    targetPost,
    allPostsCount,
    mainPosts,
    hasMorePost,
    loadPostsLoading,
    retweetPostDone,
    loadPostDone,
    addCommentDone,
  } = useSelector((state) => state.postReducer);

  useEffect(() => {
    if (targetPost && loadPostDone) {
      if (allPostsCount !== 0 || addCommentDone) {
        router.push(`/post/${targetPost.id}`).then((() => window.scrollTo(0, 0)));
      }
    }
  }, [loadPostDone, targetPost, addCommentDone]);

  useEffect(() => {
    if (isLoggedOut || (!isLoggedIn && !myInfo)) {
      router.push('/');
    }
  }, [isLoggedOut, isLoggedIn, myInfo]);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 400) {
        if (hasMorePost && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;

          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [dispatch, hasMorePost, loadPostsLoading, mainPosts]);

  useEffect(() => {
    if (retweetPostDone) {
      return router.push(`/user/${myInfo?.id}`).then((() => window.scrollTo(0, 0)));
    }
  }, [retweetPostDone]);

  return (
    <>
      <Head>
        <title>홈 | SNS</title>
      </Head>
      <AppLayout>
        <AppHeader title="홈" myInfo={myInfo}/>
        {myInfo && <PostForm main />}
        {mainPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            myInfo={myInfo}
            retweetPostDone={retweetPostDone}
            loadPostDone={loadPostDone}
          />
        ))}
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';

  //* 서버를 통해서 요청할 때 쿠키가 필요한 경우에만 default 설정해주고 다른 경우엔 비워줄 것
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  context.store.dispatch(END);

  await context.store.sagaTask.toPromise();
});

export default Home;
