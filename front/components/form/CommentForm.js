import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';

import { CommentFormWrapper } from './styles';
import useInput from '../../hooks/useInput';
import { ADD_COMMENT_REQUEST, LOAD_POST_REQUEST } from '../../reducers/post';

const CommentForm = ({ post, handleCancel }) => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.myInfo?.id);
  const { addCommentDone } = useSelector((state) => state.postReducer);

  const [commentText, onChangeCommentText, setCommentText] = useInput('');

  useEffect(() => {
    if (addCommentDone) {
      setCommentText('');
    }
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    if (!commentText || !commentText.trim()) {
      return alert('내용을 입력해주세요.');
    }

    dispatch({
      type: LOAD_POST_REQUEST,
      data: post.id,
    });
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: id },
    });

    return handleCancel();
  }, [commentText, post.id, dispatch]);

  return (
    <CommentFormWrapper>
      <Form onFinish={onSubmitComment}>
        <Input
          value={commentText}
          onChange={onChangeCommentText}
          placeholder="전하고 싶은 말을 남겨보세요."
        />
        <Button
          type="primary"
          htmlType="submit"
          shape="round"
        >
          댓글 등록하기
        </Button>
      </Form>
    </CommentFormWrapper>
  );
};

CommentForm.proptypes = {
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
  handleCancel: PropTypes.func.isRequired,
};

export default CommentForm;
