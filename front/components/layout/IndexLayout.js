import React from 'react';
import { PropTypes } from 'prop-types';
import { Row, Col } from 'antd';

import { IndexContentsWrapper, IndexBackGround, IndexLayoutWrapper } from './styles';

const IndexLayout = ({ children }) => (
  <IndexLayoutWrapper>
    <main>
      <Row>
        <Col xs={24} md={11}>
          <IndexContentsWrapper>
            {children}
          </IndexContentsWrapper>
        </Col>
        <Col xs={24} md={13}>
          <IndexBackGround />
        </Col>
      </Row>
    </main>
  </IndexLayoutWrapper>
);

IndexLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default IndexLayout;
