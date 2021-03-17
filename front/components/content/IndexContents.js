import React from 'react';
import Link from 'next/link';
import { Button, Row, Col } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

import { IndexContentsWrapper } from './styles';

const IndexContents = () => (
  <IndexContentsWrapper>
    <div className="contents">
      <Row>
        <Col xs={24} md={20} className="tip-icon">
          <MessageOutlined />
        </Col>
        <Col xs={24} md={20} className="tit">
          <span>즐거운 일상이 가득한</span>
        </Col>
        <Col xs={24} md={20} className="sub-tit">
          <span>오늘 SOCIAL MEDIA에 가입하세요.</span>
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={12}>
          <Link href="/signup">
            <a><Button type="primary" shape="round">가입하기</Button></a>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={12}>
          <Link href="/login">
            <a><Button shape="round">로그인</Button></a>
          </Link>
        </Col>
      </Row>
    </div>
  </IndexContentsWrapper>
);

export default IndexContents;
