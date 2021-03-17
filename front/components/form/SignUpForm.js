import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import { Form, Input, Checkbox, Button } from 'antd';

import { SignUpFormWrapper } from './styles';
import FormHeader from '../header/FormHeader';
import useInput from '../../hooks/useInput';
import { SIGN_UP_REQUEST } from '../../reducers/user';
import useActiveFocus from '../../hooks/useActiveFocus';
import { checkPropTypes } from 'prop-types';

const SignUpForm = ({ isSigningUp }) => {
  useEffect(() => {
    useActiveFocus();
  }, []);

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmit = useCallback(() => {
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname },
    });

    console.log(email, nickname, password);
  }, [
    email,
    password,
  ]);

  const formItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
      },
      md: {
        span: 16,
      },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      md: {
        span: 16,
        offset: 0,
      },
    },
  };

  return (
    <SignUpFormWrapper>
      <Head>
        <title>회원가입 | SNS</title>
      </Head>
      <div className="contents">
        <FormHeader title="회원가입" />
        <Form
          wrapperCol={formItemLayout.wrapperCol}
          form={form}
          name="form"
          onFinish={onSubmit}
          scrollToFirstError
        >
          <Form.Item
            name="user-email"
            rules={[
              {
                type: 'email',
                message: '이메일 형식에 맞게 작성해주세요.',
              },
              {
                required: true,
                message: '이메일 입력은 필수입니다.',
              },
            ]}
            data-title="이메일"
            data-active=""
          >
            <Input
              value={email}
              onChange={onChangeEmail}
              size="large"
              autoComplete="off"
            />

          </Form.Item>
          <Form.Item
            name="user-nickname"
            rules={[
              {
                required: true,
                message: '닉네임을 입력해주세요.',
                // whitespace: true,
              },
            ]}
            data-title="닉네임"
            data-active=""
          >
            <Input
              value={nickname}
              onChange={onChangeNickname}
              size="large"
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item
            name="user-password"
            rules={[
              {
                required: true,
                message: '비밀번호를 입력해주세요.',
              },
            ]}
            hasFeedback
            data-title="비밀번호"
            data-active=""
          >
            <Input
              type="password"
              value={password}
              onChange={onChangePassword}
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="user-password-check"
            dependencies={['user-password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '비밀번호 확인란을 입력해주세요.',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('user-password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('비밀번호가 일치하지 않습니다.');
                },
              }),
            ]}
            data-title="비밀번호 확인"
            data-active=""
          >
            <Input
              type="password"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="user-term"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) => (value ? Promise.resolve() : Promise.reject('약관에 동의해야 합니다.')),
              },
            ]}
            wrapperCol={tailFormItemLayout.wrapperCol}
          >
            <Checkbox>
              <Link href="#"><a>개인정보처리방침</a></Link>에 동의합니다.
            </Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={tailFormItemLayout.wrapperCol}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSigningUp}
              size="large"
              shape="round"
            >
              가입하기
            </Button>
          </Form.Item>
        </Form>
      </div>
    </SignUpFormWrapper>
  );
};

SignUpForm.prototypes = {
  isSigningUp: PropTypes.bool,
};

export default SignUpForm;
