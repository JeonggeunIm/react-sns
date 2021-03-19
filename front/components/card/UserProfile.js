import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Avatar, Button, Popover } from 'antd';
import { EllipsisOutlined, UserOutlined } from '@ant-design/icons';

import { UserProfileWrapper } from './styles';
import { LOG_OUT_REQUEST } from '../../reducers/user';
import { backURL } from '../../config/config';

const PopoverContent = ({ isLoggingOut, onLogOut, myInfo }) => (
  <Button
    className="btn-logout"
    onClick={onLogOut}
    loading={isLoggingOut}
  >
    {`@${myInfo?.email.split('@')[0]} 님 계정에서 로그아웃`}
  </Button>
);

const CardContent = ({ myInfo, profileSrc }) => (
  <Card>
    <Card.Meta
      avatar={
        <Avatar
          size={60}
          {...(profileSrc ? { src: profileSrc } : { icon: <UserOutlined /> })}
        />
      }
      title={myInfo?.nickname}
      description={`@${myInfo?.email.split('@')[0]}`}
    />
  </Card>
);

const UserProfile = () => {
  const dispatch = useDispatch();
  const { myInfo, isLoggingOut } = useSelector((state) => state.user);

  const profileSrc = myInfo?.Profile?.profileSrc;
  const [visible, setVisible] = useState(false);

  const onLogOut = useCallback(() => {
    dispatch({ type: LOG_OUT_REQUEST });
  }, [dispatch]);

  const handleVisibleChange = (afterVisible) => setVisible(afterVisible);

  return (
    <UserProfileWrapper>
      {myInfo && (
        <>
          <Popover
            className="profile-popover"
            content={(
              <PopoverContent
                isLoggingOut={isLoggingOut}
                onLogOut={onLogOut}
                myInfo={myInfo}
              />
            )}
            title={<CardContent myInfo={myInfo} profileSrc={profileSrc} />}
            trigger="click"
            visible={visible}
            onVisibleChange={handleVisibleChange}
            placement="bottom"
          >
            <Card>
              <Card.Meta
                avatar={(
                  <Avatar
                    size={{ sm: 32, md: 48, lg: 48, xl: 48, xxl: 48 }}
                    {...(profileSrc ? { src: profileSrc } : { icon: <UserOutlined /> })}
                  />
                )}
                title={myInfo?.nickname}
                description={`@${myInfo?.email.split('@')[0]}`}
              />
              <EllipsisOutlined />
            </Card>
          </Popover>
        </>
      )
      }
    </UserProfileWrapper>
  );
};

export default UserProfile;
