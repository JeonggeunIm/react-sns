import styled from 'styled-components';

export const AppHeaderWrapper = styled.div`
  position: fixed;
  display: flex;
  width: 33.33333333%;
  min-width: 530px;
  height: 60px;
  padding: ${({ title }) => !!title && ((title === '홈' || title.charAt(0) === '#') ? '0 20px' : '4px 20px')};
  top: 0;
  border-bottom: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
  background: #fff;
  line-height: ${({ title }) => !!title && ((title === '홈' || title.charAt(0) === '#') ? '60px' : 'auto')};
  transition: .2s all;
  z-index: 100;

  .btn-area {
    width: 40px;

    .anticon-arrow-left {
      color: #1890ff;
      font-size: 24px;
      line-height: 52px;
    }
  }
  h1 {
    margin: 0;
    font-size: 20px;
  }
  span:nth-of-type(n+2) {
    padding-left: 10px;
  }

  @media screen and (max-width: 1599px) {
    width: 50%;
  }

  @media screen and (max-width: 767px) {
    width: 100%;
    min-width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    top: 60px;
  }
`;

export const FormHeaderWrapper = styled.div`
  h1 {
    margin-bottom: 30px;
    font-size: 30px;
  }
  .anticon {
    position: absolute;
    top: 8.5px;
    right: 0;
    color: rgba(0, 0, 0, 0.85);
    font-size: 30px;
  }

  @media screen and (max-width: 767px) {
    h1 {
      margin-bottom: 20px;
      font-size: 24px;
    }
    .anticon {
      top: 6.5px;
      font-size: 24px;
    }
  }
`;
