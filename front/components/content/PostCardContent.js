import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { PostCardContentWapper } from './styles';
import PostImages from './PostImages';

const PostCardContent = ({ post, commentOpened }) => {
  const content = post.RetweetId && post.Retweet ? post.Retweet.content : post.content;

  const onPreventClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <PostCardContentWapper commentOpened={commentOpened}>
      <div className="text-area">
        {
          content.split(/(#[^\s#]+)/g).map((v, i) => {
            if (v.match(/(#[^\s#]+)/g)) {
              return (
                <Link href={`/hashtag/${v.slice(1)}`} key={i} prefetch={false}>
                  <a className="hashtag" onClick={onPreventClick} role="link" alt={`${v}태그 검색하기`}>{v}</a>
                </Link>
              );
            }
            return v;
          })
        }
      </div>
      {
        post.RetweetId && post.Retweet
          ? post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />
          : post.Images[0] && <PostImages images={post.Images} />
      }
    </PostCardContentWapper>
  );
};

PostCardContent.proptypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isrequired,
  commentOpened: PropTypes.bool,
};

export default PostCardContent;
