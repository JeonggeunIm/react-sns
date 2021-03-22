import React, { useCallback, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';

import { PostImagesWrapper } from './styles';
import ImagesZoom from './imagesZoom';
import { backURL } from '../../config/config';

const PostImages = ({ images }) => {
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [defaultPageNum, setDefaultPageNum] = useState(0);

  const onZoom = useCallback((e) => {
    e.stopPropagation();

    const clickedIndex = [].indexOf.call(e.target.parentNode.children, e.target);

    setDefaultPageNum(clickedIndex);
    setShowImageZoom((prev) => !prev);
  }, [showImageZoom, defaultPageNum]);

  const onClose = useCallback(() => {
    setShowImageZoom((prev) => !prev);
  }, []);

  const imgBackgroundStyle = useMemo(() => (
    images.map((image) => ({
      background: `url(${image.src}) no-repeat center / cover`,
    }))
  ), [images]);

  return (
    <PostImagesWrapper images={images}>
      {
        images.map((image, i) => (
          <div
            className="imageWrapper"
            style={imgBackgroundStyle[i]}
            onClick={onZoom}
            key={image.src}
          >
            <img role="presentation" src={image.src} alt={`${i + 1}번 째 이미지`} />
          </div >
        ))
      }
      {showImageZoom && <ImagesZoom images={images} onClose={onClose} defaultPageNum={defaultPageNum} />}
    </PostImagesWrapper>
  );
};

PostImages.proptypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;
