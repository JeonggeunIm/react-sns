import React, { useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import { UPLOAD_COVER_IMAGE_REQUEST } from '../../reducers/user';

const CoverEditButton = () => {
  const dispatch = useDispatch();
  const imageInput = useRef();
  const { uploadCoverImageLoading } = useSelector((state) => state.user);

  const onClick = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  // file 선택 시 업로드
  const onChangeImageUpload = useCallback((e) => {
    if (e.target.files.length > 1) {
      return alert('커버 사진은 1장만 변경 가능합니다.');
    }

    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (file) => {
      imageFormData.append('image', file);
    });

    dispatch({
      type: UPLOAD_COVER_IMAGE_REQUEST,
      data: imageFormData,
    });
  }, [dispatch]);

  return (
    <>
      <input
        type="file"
        name="image"
        accept="image/*"
        placeholder="커버 이미지 업로드"
        hidden
        ref={imageInput}
        onChange={onChangeImageUpload}
      />
      <Button shape="circle" onClick={onClick} loading={uploadCoverImageLoading} icon={<EditOutlined />} />
    </>
  );
};

export default CoverEditButton;
