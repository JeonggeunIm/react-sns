import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Avatar } from 'antd';
import moment from 'moment';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import FollowButton from '../button/FollowButton';
import ProfileEditButton from '../button/ProfileEditButton';
import CoverEditButton from '../button/CoverEditButton';
import { ProfileCardWrapper } from './styles';

moment.locale('ko');

const ProfileCard = ({ userInfo }) => {
  // console.log(userInfo);
  const id = useSelector((state) => state.user.myInfo?.id);
  const profileSrc = useSelector((state) => state.user.userInfo?.Profile?.profileSrc);
  const coverSrc = useSelector((state) => state.user.userInfo.Profile?.coverSrc);
  const { followDone, unfollowDone } = useSelector((state) => state.user);
  const [followingNum, setFollowingNum] = useState(userInfo.Followings);
  const [followerNum, setFollowerNum] = useState(userInfo.Followers);

  useEffect(() => {
    if (followDone) {
      if (id === userInfo.id) {
        setFollowingNum((prev) => prev + 1);
      } else {
        setFollowerNum((prev) => prev + 1);
      }
    }
  }, [followDone]);

  useEffect(() => {
    if (unfollowDone) {
      if (id === userInfo.id) {
        setFollowingNum((prev) => prev - 1);
      } else {
        setFollowerNum((prev) => prev - 1);
      }
    }
  }, [unfollowDone]);

  return (
    <ProfileCardWrapper
      cover={(
        <>
          {
            coverSrc
              ? (
                <img
                  alt={`${userInfo.nickname}님의 커버 이미지`}
                  src={coverSrc}
                />
              )
              : null
          }
          {id
            && (
              (id !== userInfo.id) ? null : <CoverEditButton />
            )}
        </>
      )}
      extra={
        id
        && (
          (id !== userInfo.id) ? <FollowButton userInfo={userInfo} /> : <ProfileEditButton />
        )
      }
    >
      <Card.Meta
        avatar={(
          <Avatar
            size={150}
            {...(profileSrc ? { src: profileSrc } : { icon: <UserOutlined /> })}
          />
        )}
        title={userInfo.nickname}
        description={`@${userInfo.email.split('@')[0]}`}
      />
      <span className="reg-date"><CalendarOutlined /> 가입일 : {moment(userInfo.createdAt).format('YYYY.MM.DD')}</span>
      <div className="number">
        <span><em>{followingNum}</em> 팔로잉</span>
        <span><em>{followerNum}</em> 팔로워</span>
      </div>
    </ProfileCardWrapper>
  );
};

ProfileCard.proptypes = {
  userInfo: PropTypes.object.isRequired,
};

export default ProfileCard;
