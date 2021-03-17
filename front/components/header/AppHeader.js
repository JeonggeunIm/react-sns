import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { ArrowLeftOutlined } from '@ant-design/icons';

import { AppHeaderWrapper } from './styles';

const AppHeader = ({ title, userInfo, targetPost }) => {
  const router = useRouter();
  const [isHome, setIsHome] = useState(true);
  const dispatch = useDispatch();

  const onClickBack = useCallback(() => {
    router.back();
  }, [dispatch]);

  useEffect(() => {
    if (router.pathname !== '/home') {
      setIsHome(false);
    }
  }, []);

  return (
    <AppHeaderWrapper title={title}>
      {
        !isHome
          ? (
            <div className="btn-area">
              <ArrowLeftOutlined aria-label="뒤로 가기" onClick={onClickBack} />
            </div>
          )
          : null
      }
      <div className="title-area">
        <h1>{title}</h1>
        {
          !isHome
            && userInfo
            ? <span>{userInfo.Posts} 포스트</span>
            : targetPost && (
              <>
                <span>{targetPost.Comments.length} 댓글</span>
                <span>{targetPost.Likers.length} 좋아요</span>
              </>
            )
        }
      </div>
    </AppHeaderWrapper>
  );
};

AppHeader.proptypes = {
  title: PropTypes.string,
  userInfo: PropTypes.object.isRequired,
  targetPost: PropTypes.object.isRequired,
};

export default AppHeader;
