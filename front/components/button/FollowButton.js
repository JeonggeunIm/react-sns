import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';

import { UNFOLLOW_REQUEST, FOLLOW_REQUEST } from '../../reducers/user';

const FollowButton = ({ userInfo, postCard = false }) => {
  const dispatch = useDispatch();
  const { myInfo, followLoading, unfollowLoading } = useSelector((state) => state.user);

  const isFollowing = myInfo?.Followings.find((v) => v.id === userInfo.id);
  const defaultStyle = useMemo(() => (
    postCard
      ? {
        color: 'inherit',
        background: '#fff',
      }
      : {
        color: '#1890ff',
        background: '#fff',
        border: '1px solid #1890ff',
      }
  ), [postCard]);

  // 팔로잉 여부에 따라 팔로우 & 언팔로우
  const onClickButton = useCallback((e) => {
    e.stopPropagation();

    if (isFollowing) {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: userInfo.id,
      });
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: userInfo.id,
      });
    }
  }, [dispatch, isFollowing, userInfo]);

  return (
    <div className="btn-area">
      <Button
        className="btn-follow"
        style={!isFollowing ? defaultStyle : null}
        type="primary"
        shape="round"
        loading={followLoading || unfollowLoading}
        onClick={onClickButton}
      >
        {isFollowing ? `${userInfo.nickname}님 팔로우 취소` : `${userInfo.nickname}님 팔로우`}
      </Button>
    </div>
  );
};

FollowButton.proptypes = {
  userInfo: PropTypes.object.isRequired,
  postCard: PropTypes.bool,
};

export default FollowButton;
