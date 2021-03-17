import styled, { createGlobalStyle } from 'styled-components';
import { CloseCircleFilled } from '@ant-design/icons';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
`;

export const Header = styled.header`
  height: 100px;
  position: relative;
  padding: 0;
  background-color: rgba(0,0,0,.8);
`;

export const CloseBtn = styled(CloseCircleFilled)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 30px;
  color: rgba(255,255,255,.8);
  font-size: 40px;
  cursor: pointer;
`;

export const SlickWrapper = styled.div`
  height: calc(100% - 100px);
  background-color: rgba(0,0,0,.8);
`;

export const ImageWrapper = styled.div`
  padding: 20px 60px;
  text-align: center;

  & > img {
    max-width: 90%;
  }
`;

export const Indicator = styled.div`
  text-align: center;

  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    background-color: rgba(0,0,0,.9);
    display: inline-block;
    text-align: center;
    color: white;
    font-size: 15px;
  }
`;

export const Global = createGlobalStyle`
  .slick-slider {
    position: relative;
  }
  .slick-slide {
    display: inline-block;
  }
  .slick-prev, .slick-next {
    position: absolute;
    top: 50%;
    transition: translateY(-50%);
    z-index: 9999;
    font-size: 40px;
    color: rgba(255,255,255,.8);
  }
  .slick-prev {
    left: 20px;
  }
  .slick-next {
    right: 20px;
  }
`;
