import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import { Overlay, Header, SlickWrapper, CloseBtn, ImageWrapper, Indicator, Global } from './styles';
import { backURL } from '../../../config/config';

const ImagesZoom = ({ images, onClose, defaultPageNum }) => {
  const [currentSlide, setCurrenSlide] = useState(defaultPageNum);
  const settings = {
    initialSlide: defaultPageNum,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setCurrenSlide(current),
    prevArrow: <LeftOutlined />,
    nextArrow: <RightOutlined />,
  };

  return (
    <Overlay onClick={(e) => e.stopPropagation()}>
      <Global />
      <Header>
        <span className="ir_so"><h1>상세 이미지</h1></span>
        <CloseBtn onClick={onClose}>X</CloseBtn>
      </Header>
      <SlickWrapper>
        <div>
          <Slider {...settings}>
            {images.map((v) => (
              <ImageWrapper key={v.src}>
                <img src={v.src} alt={v.src} />
              </ImageWrapper>
            ))}
          </Slider>
          <Indicator>
            <div>
              {`${currentSlide + 1} / ${images.length}`}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.proptypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
  defaultPageNum: PropTypes.number.isRequired,
};

export default ImagesZoom;
