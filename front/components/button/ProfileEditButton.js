import React, { useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';

import { UPLOAD_PROFILE_IMAGE_REQUEST } from '../../reducers/user';

const ProfileEditButton = () => {
  const dispatch = useDispatch();
  const imageInput = useRef();
  const { uploadProfileImageLoading } = useSelector((state) => state.user);

  const onClick = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImageUpload = useCallback((e) => {
    if (e.target.files.length > 1) {
      return alert('프로필 사진은 1장만 변경 가능합니다.');
    }

    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (file) => {
      imageFormData.append('image', file);
    });

    dispatch({
      type: UPLOAD_PROFILE_IMAGE_REQUEST,
      data: imageFormData,
    });
  }, [dispatch]);

  return (
    <>
      <input
        type="file"
        name="image"
        accept="image/*"
        placeholder="프로필 이미지 업로드"
        hidden
        ref={imageInput}
        onChange={onChangeImageUpload}
      />
      <Button type="primary" shape="round" onClick={onClick} loading={uploadProfileImageLoading}>
        프로필 사진 변경하기
      </Button>
    </>
  );
};

export default ProfileEditButton;
