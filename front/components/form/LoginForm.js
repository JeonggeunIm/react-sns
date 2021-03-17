import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { LoginFormWrapper } from './styles';
import useInput from '../../hooks/useInput';
import FormHeader from '../header/FormHeader';
import { LOG_IN_REQUEST } from '../../reducers/user';
import useActiveFocus from '../../hooks/useActiveFocus';

const LoginForm = ({ formLayout }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [form] = Form.useForm();

  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const { isLoggingIn, logInErr } = useSelector((state) => state.user);

  useEffect(() => {
    if (logInErr) {
      alert(logInErr);
    }
  }, [logInErr]);

  useEffect(() => {
    useActiveFocus();
  }, []);

  const onSubmitForm = useCallback(() => {
    dispatch({
      type: LOG_IN_REQUEST,
      data: { email, password },
    });
  }, [email, password]);

  const formItemLayout = formLayout === 'inline'
    ? {
      wrapperCol: {
        sm: {
          span: 24,
        },
        md: {
          span: 24,
        },
      },
    }
    : {
      wrapperCol: {
        sm: {
          span: 24,
        },
        md: {
          span: 16,
        },
      },
    };

  return (
    <>
      <LoginFormWrapper formLayout={formLayout}>
        <div className="contents">
          {router.pathname === '/login' ? <FormHeader title="로그인" /> : null}
          <Form
            wrapperCol={formItemLayout.wrapperCol}
            layout={formLayout}
            form={form}
            name="form"
            onFinish={onSubmitForm}
            scrollToFirstError
          >
            <Form.Item
              name="user-email"
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
              name="user-password"
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
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoggingIn}
                size="large"
                shape="round"
              >
                로그인
              </Button>
            </Form.Item>
          </Form>
        </div>
      </LoginFormWrapper>
    </>
  );
};

LoginForm.proptypes = {
  formLayout: PropTypes.string.isRequired,
};

export default LoginForm;
