import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import { useSelector } from 'react-redux';
import Head from 'next/head';

import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_POST_REQUEST } from '../../reducers/post';
import AppLayout from '../../components/layout/AppLayout';
import PostCard from '../../components/card/PostCard';
import AppHeader from '../../components/header/AppHeader';

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { targetPost, retweetPostError, retweetPostDone, addCommentDone } = useSelector((state) => state.postReducer);
  const { myInfo, isLoggedIn, isLoggedOut } = useSelector((state) => state.user);

  useEffect(() => {
    if (isLoggedOut && !isLoggedIn && !myInfo) {
      router.push('/');
    }
  }, [isLoggedOut, isLoggedIn, myInfo]);


  useEffect(() => {
    if (retweetPostDone) {
      return router.push(`/user/${myInfo?.id}`).then((() => window.scrollTo(0, 0)));
    }
  }, [retweetPostDone]);

  if (!targetPost) return <div />;

  return (
    <AppLayout>
      <Head>
        <title>
          {targetPost.User.nickname}님의 글
        </title>
        <meta name="description" content={targetPost.content} />
        {/* SNS 공유 시 제공되는 정보, 미리보기 등 */}
        <meta property="og:title" content={`${targetPost.User.nickname}님의 게시글`} />
        <meta property="og:description" content={targetPost.content} />
        <meta property="og:image" content={targetPost.Images[0] ? targetPost.Images[0].src : 'https://nodebird.com/favicon.ico'} />
        <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
      </Head>
      <AppHeader title="포스트" targetPost={targetPost} />
      <PostCard
        post={targetPost}
        myInfo={myInfo}
        commentOpened
        retweetPostError={retweetPostError}
        retweetPostDone={retweetPostDone}
        addCommentDone={addCommentDone}
      />
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
    type: LOAD_POST_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Post;
