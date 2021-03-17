import styled, { css } from 'styled-components';

export const IndexContentsWrapper = styled.section`
  position: relative;
  height: calc(100% - 100px);

  & > .contents {
    position: absolute;
    width: calc(100% - 100px);
    transform: translateY(-50%);
    top: 45%;
    left: 50px;

    .tip-icon {
      color: #1890ff;
      font-size: 50px;
    }
    .tit {
      margin-bottom: 20px;
      font-size: 65px;
      font-weight: 700;
      word-break: keep-all;
    }
    .sub-tit {
      margin-bottom: 60px;
      font-size: 30px;
      font-weight: 600;
      word-break: keep-all;
    }
  }
  .ant-btn {
    width: 100%;
    min-width: 100px;
    height: 50px;
    margin-bottom: 30px;
    font-size: 18px;
    font-weight: 500;
  }

  @media screen and (max-width: 767px) {
    height: 100%;

    & > .contents {
      width: auto;
      top: 50%;
      left: 15%;
      right: 15%;

      .tit {
        font-size: 30px;
        margin-bottom: 0;
      }
      .sub-tit  {
        font-size: 20px;
        margin-bottom: 20px;
      }
    }
    .ant-btn {
      margin-bottom: 15px;
    }
  }
`;

export const PostCardContentWapper = styled.div`
  padding-left: 56px;

  .text-area {
    margin: -10px 0 10px;
    font-size: ${({ commentOpened }) => (commentOpened ? '25px' : '16px')};
    white-space: pre;
    a {
      color: rgba(0, 0, 0, 0.85);
    }
    a.hashtag {
      color: #1890ff;
    }
  }
`;

export const PostImagesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 300px;
  margin-bottom: 6px;
  border: 2px solid #d3d3d3;
  border-radius: 20px;
  overflow: hidden;

  .imageWrapper {
    height: ${({ images }) => (images && (images.length > 2) ? '50%' : '100%')};
    flex: 1 1 50%;
  }
  .imageWrapper img {
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0px;
    opacity: 0;
    z-index: -1;
  }
`;
