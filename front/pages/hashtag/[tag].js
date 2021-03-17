import React, { useEffect, useMemo } from 'react';
import axios from 'axios';
import { END } from 'redux-saga';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import wrapper from '../../store/configureStore';
import AppLayout from '../../components/layout/AppLayout';
import PostCard from '../../components/card/PostCard';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import AppHeader from '../../components/header/AppHeader';

const Hashtag = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tag } = router.query;
  const { myInfo, isLoggedIn, isLoggedOut } = useSelector((state) => state.user);
  const {
    mainPosts,
    allPostsCount,
    targetPost,
    hasMorePost,
    loadPostsLoading,
    loadPostDone,
  } = useSelector((state) => state.postReducer);

  const nullMessageStyle = useMemo(() => ({
    marginTop: '100px',
    textAlign: 'center',
    fontSize: '20px',
    color: '#666',
  }), []);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 400) {
        if (hasMorePost && !loadPostsLoading) {
          dispatch({
            type: LOAD_HASHTAG_POSTS_REQUEST,
            lastId: mainPosts[mainPosts.length - 1]?.id,
            data: tag,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePost, loadPostsLoading, mainPosts.length, tag]);

  useEffect(() => {
    if (targetPost && loadPostDone && allPostsCount !== 0) {
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
      <AppHeader title={`#${tag}`} />
      {mainPosts.length !== 0
        ? mainPosts.map((post) => <PostCard key={post.id} post={post} />)
        : <div style={nullMessageStyle}>검색된 결과가 없습니다.</div>}
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
    type: LOAD_HASHTAG_POSTS_REQUEST,
    data: context.params.tag,
  });
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Hashtag;
