import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PropTypes } from 'prop-types';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { Menu, Input, Row, Col, Button, Modal } from 'antd';
import { HomeOutlined, UserOutlined, MessageOutlined, SearchOutlined, SendOutlined } from '@ant-design/icons';

import { AppLayoutWrapper } from './styles';
import useInput from '../../hooks/useInput';
import UserProfile from '../card/UserProfile';
import PostForm from '../form/PostForm';
import { UPDATE_IMAGES, SHOW_IMAGES_PREVIEW } from '../../reducers/post';

const AppLayout = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { myInfo } = useSelector((state) => state.user);

  const [searchInput, onChangeSearchInput] = useInput('');
  const [postVisible, setPostVisible] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  useEffect(() => {
    if (router.asPath === '/home') {
      setIsHome(true);
      setIsProfile(false);
    } else {
      setIsHome(false);
      if (router.asPath === `/user/${myInfo?.id}`) {
        setIsProfile(true);
      } else {
        setIsProfile(false);
      }
    }
  });
  const onSearch = useCallback(() => {
    if (!searchInput || !searchInput.trim()) {
      return alert('검색할 태그명을 입력해주세요.');
    }

    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  const showPostModal = useCallback((e) => {
    e.stopPropagation();

    setPostVisible(true);

    dispatch({
      type: UPDATE_IMAGES,
      data: [],
    });

    dispatch({
      type: SHOW_IMAGES_PREVIEW,
      data: false,
    });
  }, [dispatch]);

  const handlePostCancel = useCallback(() => {
    setPostVisible(false);
  }, []);

  return (
    <AppLayoutWrapper postVisible={postVisible} isHome={isHome} isProfile={isProfile}>
      <Row>
        <Col xs={24} md={10} xl={10}>
          <Menu mode="vertical">
            <Menu.Item key="logo">
              <Link href="/home">
                <a><MessageOutlined /><span className="ir_so">SNS 로고</span></a>
              </Link>
            </Menu.Item>
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <Link href="/home"><a>홈</a></Link>
            </Menu.Item>
            <Menu.Item key="profile" icon={<UserOutlined />}>
              <Link href={`/user/${myInfo?.id}`}><a>프로필</a></Link>
            </Menu.Item>
            <Menu.Item key="search">
              <Input.Search
                value={searchInput}
                onChange={onChangeSearchInput}
                onSearch={onSearch}
                prefix={<SearchOutlined />}
                placeholder="태그 검색"
                allowClear
              />
            </Menu.Item>
            <Menu.Item key="user">
              <UserProfile />
            </Menu.Item>
            <Menu.Item key="post">
              <Button
                onClick={showPostModal}
                className="postBtn"
                type="primary"
                shape="round"
                icon={<SendOutlined />}
              >
                포스트하기
              </Button>
            </Menu.Item>
          </Menu>
        </Col>
        <Col xs={24} md={12} xl={12} xxl={8}>
          {children}
        </Col>
        <Col xs={0} md={0} xl={0} xxl={8}>
          <UserProfile />
          <Input.Search
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
            prefix={<SearchOutlined />}
            placeholder="태그 검색"
            allowClear
          />
        </Col>
      </Row>
      <Modal
        title="포스트하기"
        visible={postVisible}
        onCancel={handlePostCancel}
        centered
      >
        <PostForm handlePostCancel={handlePostCancel} popup />
      </Modal>
    </AppLayoutWrapper>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
