import React, { useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { END } from 'redux-saga';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import wrapper from '../store/configureStore';
import IndexLayout from '../components/layout/IndexLayout';
import LoginForm from '../components/form/LoginForm';
import IndexContents from '../components/content/IndexContents';
import { LOAD_MY_INFO_REQUEST, LOG_IN_REQUEST } from '../reducers/user';

const Index = () => {
  const router = useRouter();
  const { logInErr, myInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (logInErr) {
      alert(logInErr);
    }
  }, [logInErr]);

  useEffect(() => {
    if (myInfo) {
      router.push('/home').then((() => window.scrollTo(0, 0)));
    }
  }, [myInfo]);

  return (
    <>
      <Head>
        <title>SNS</title>
      </Head>
      <IndexLayout>
        <LoginForm formLayout="inline" />
        <IndexContents />
      </IndexLayout>
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

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Index;
