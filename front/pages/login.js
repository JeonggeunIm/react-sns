import React, { useEffect } from 'react';
import axios from 'axios';
import { END } from 'redux-saga';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';
import IndexLayout from '../components/layout/IndexLayout';
import LoginForm from '../components/form/LoginForm';

const Login = () => {
  const router = useRouter();
  const { myInfo, isLoggingIn, logInErr } = useSelector((state) => state.user);

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
    <IndexLayout>
      <LoginForm isLoggingIn={isLoggingIn} formLayout="horizontal" />
    </IndexLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';

  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Login;
