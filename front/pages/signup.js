import React, { useEffect } from 'react';
import axios from 'axios';
import { END } from 'redux-saga';
import Router, { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import wrapper from '../store/configureStore';
import IndexLayout from '../components/layout/IndexLayout';
import SignUpForm from '../components/form/SignUpForm';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

const Signup = () => {
  const router = useRouter();
  const { myInfo, isSigningUp, isSignedUp, signUpErr, isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    if (isSignedUp) {
      Router.replace('/');
    }
  }, [isSignedUp]);

  useEffect(() => {
    if (signUpErr) {
      alert(signUpErr);
    }
  }, [signUpErr]);

  useEffect(() => {
    if (isLoggedIn) {
      Router.replace('/');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (myInfo) {
      router.push('/home').then((() => window.scrollTo(0, 0)));
    }
  }, [myInfo]);

  return (
    <IndexLayout>
      <SignUpForm isSigningUp={isSigningUp} />
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

export default Signup;
