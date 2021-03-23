import React from 'react';
import { PropTypes } from 'prop-types';
import Link from 'next/link';
import moment from 'moment';
import { List, Comment, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { backURL } from '../../config/config';

moment.locale('ko');

const CommentsList = ({ orderedComments }) => (
  <List
    itemLayout="horizontal"
    dataSource={orderedComments}
    renderItem={(item) => (
      <List.Item key={item.id}>
        <Comment
          author={(
            <>
              <span>{item.User.nickname}</span>
              <span>{`@${item.User.email.split('@')[0]}`}</span>
              <span>{moment(item.createdAt).format('YYYY.MM.DD')}</span>
            </>
          )}
          content={item.content}
          avatar={(
            <Link href={`/user/${item.User.id}`} prefetch={false}>
              <a>
                <Avatar
                  size={48}
                  {...(item.User.Profile?.profileSrc
                    ? { src: item.User.Profile.profileSrc }
                    : { icon: <UserOutlined /> })}
                />
              </a>
            </Link>
          )}
        />
      </List.Item>
    )}
  />
);

CommentsList.proptypes = {
  orderedComments: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CommentsList;
