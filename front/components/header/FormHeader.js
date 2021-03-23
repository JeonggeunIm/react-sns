import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Row, Col } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { FormHeaderWrapper } from './styles';

const FormHeader = ({ title }) => (
  <FormHeaderWrapper>
    <Row>
      <Col xs={24} md={16}>
        <h1>{title}</h1>
        <Link href="/" prefetch={false}>
          <a title="뒤로 가기"><CloseOutlined weight="300" /></a>
        </Link>
      </Col>
    </Row>
  </FormHeaderWrapper>
);

FormHeader.proptypes = {
  title: PropTypes.string.isRequired,
};

export default FormHeader;
