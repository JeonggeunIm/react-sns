import React, { useCallback, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Avatar, Row, Col } from 'antd';
import { UserOutlined, FileImageOutlined, CloseOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';

import { PostFormWrapper, ImagePreviewWrapper } from './styles';
import useInput from '../../hooks/useInput';
import {
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
  ADD_POST_REQUEST,
  UPDATE_POST_REQUEST,
  SHOW_IMAGES_PREVIEW
} from '../../reducers/post';
import { backURL } from '../../config/config';

const PostForm = ({ handlePostCancel, popup = false, post, postVisible, main = false }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { imagePaths, addPostDone, showImagesPreview } = useSelector((state) => state.postReducer);
  const profileSrc = useSelector((state) => state.user.myInfo?.Profile?.profileSrc);

  const [text, onChangeText, setText] = useInput(post ? post.content : '');
  const imageInput = useRef();

  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert('게시글을 작성해 주세요.');
    }

    const formData = new FormData();

    imagePaths.forEach((path) => formData.append('image', path)); // -> req.body.image
    formData.append('content', text); // -> req.body.content
    formData.append('PostId', post.id); // -> req.body.PostId

    dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });

    return handlePostCancel();
  }, [dispatch, text, imagePaths]);

  const onEditPost = useCallback(() => {
    if (!text || !text.trim()) { // 어떤 의미인지 확인할 것
      return alert('게시글을 작성해 주세요.');
    }

    const formData = new FormData();

    imagePaths.forEach((path) => formData.append('image', path)); // -> req.body.image
    formData.append('content', text); // -> req.body.content

    dispatch({
      type: UPDATE_POST_REQUEST,
      data: formData,
      PostId: post.id
    });

    return handlePostCancel();
  }, [dispatch, text, imagePaths]);

  // antd의 버튼 디자인을 따로 사용하기 위해 input:file을 hidden 처리하고 antd 버튼의 클릭과 연동
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    if (e.target.files.length > 4) {
      return alert('사진은 최대 4개까지 업로드 가능합니다.');
    }

    if (main) {
      dispatch({
        type: SHOW_IMAGES_PREVIEW,
        data: true,
      });
    }

    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (file) => {
      imageFormData.append('image', file);
    });

    return dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, [dispatch]);

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  }, [dispatch]);

  const imgBackgroundStyle = useMemo(() =>
    imagePaths.map((v) => (
      { background: `url(${v}) no-repeat center / cover` }
    )), [imagePaths]
  );

  return (
    <PostFormWrapper popup={popup} >
      <Row>
        <Col xs={3} md={3}>
          <Avatar
            size={{ xs: 50, sm: 50, md: 60, lg: 60, xl: 60, xxl: 60 }}
            {...(profileSrc ? { src: profileSrc } : { icon: <UserOutlined /> })}
          />
        </Col>
        <Col xs={21} md={21}>
          <Form form={form} layout="inline" encType="multipart/form-data" onFinish={post ? onEditPost : onSubmit}>
            <Form.Item>
              <Input.TextArea
                value={text}
                autoSize
                onChange={onChangeText}
                maxLength={140}
                placeholder="무슨 일이 일어나고 있나요?"
              />
            </Form.Item>
            {/* 이미지 미리보기 부분 */}
            <ImagePreviewWrapper
              postVisible={postVisible}
              showImagesPreview={showImagesPreview}
              className={main ? 'main' : ''}
            >
              {imagePaths.map((v, i) => (
                <div
                  key={v}
                  className="imagePreview"
                  style={imgBackgroundStyle[i]}
                >
                  <img src={v} alt={`${i + 1}번 째 이미지`} />
                  {/* 반복문 map 안에 데이터 전달하는 이벤트 리스너 등록할 경우 고차함수 이용 */}
                  <Button type="primary" shape="circle" icon={<CloseOutlined />} onClick={onRemoveImage(i)} />
                </div>
              ))}
            </ImagePreviewWrapper>
            <Form.Item>
              <input
                type="file"
                name="image"
                accept="image/*"
                placeholder="이미지 업로드"
                multiple
                hidden
                ref={imageInput}
                onChange={onChangeImages}
              />
              <FileImageOutlined onClick={onClickImageUpload} />
            </Form.Item>
            <Form.Item>
              <Button
                className="btn-post"
                type="primary"
                shape="round"
                size="large"
                htmlType="submit"
              >
                {post ? '수정하기' : '포스트'}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </PostFormWrapper>
  );
};

PostForm.proptypes = {
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
  handlePostCancel: PropTypes.func.isRequired,
  popup: PropTypes.bool,
  postVisible: PropTypes.bool.isRequired,
  main: PropTypes.bool,
};

export default PostForm;
