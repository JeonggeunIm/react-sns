import React from 'react';
import { PropTypes } from 'prop-types';
import 'antd/dist/antd.css';

import wrapper from '../store/configureStore';
import Global from '../style/styles';

const App = ({ Component, PageProps }) => (
  <>
    <Global />
    <Component {...PageProps} />
  </>
);

App.proptypes = {
  Component: PropTypes.elementType.isRequired,
};

// hoc
export default wrapper.withRedux(App);
