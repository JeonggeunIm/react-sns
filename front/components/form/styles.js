import styled from 'styled-components';

export const CommentFormWrapper = styled.div`
  padding: 20px 20px 40px;
  background-color: #fff;

  .ant-form {
    position: relative;
  }
  .ant-btn.ant-btn-primary {
    position: absolute;
    height: 40px;
    bottom: 0;
    right:0;
    z-index: 1;
  }
  .ant-input {
    height: 60px;
    width: 70%;
    font-size: 20px;
    border: none;
    border-bottom: 1px solid #eee;
    box-shadow: none;
  }
`;

export const LoginFormWrapper = styled.div`
  padding: 30px 50px 0;
  height: 100px;
  box-sizing: border-box;
  
  .contents {
    ${({ formLayout }) => (
    (formLayout === 'inline')
      ? {
        position: 'static',
        width: '100%',
        transform: 'translateY(50px, 0)',
        top: 'auto',
        left: 'auto',
      } : {
        position: 'absolute',
        width: 'calc(100% - 160px)',
        transform: 'translate(0, -50%)',
        top: '50%',
        left: '80px',
      })}
  }
  .ant-form-inline {
    flex-wrap: nowrap;
  }
  .ant-form-item {
    position: relative;
    min-width: 100px;
    margin-bottom: 24px;
    flex: 1;
    font-size: 18px;

    &::before {
      content: attr(data-title);
      position: absolute;
      padding: 0 6px;
      top: 11px;
      left: 5px;
      color: #bbb;
      transition: 400ms all;
      z-index: 0;
    }
    input {
      padding: 21px 11px 2px;
      border: none;
      border-radius: 8px;
      box-sizing: border-box;
      background-color: transparent;
      z-index: 10;
    }
  }
  & .ant-form-item:nth-child(-n+2) {
    & .ant-form-item-control-input {
      height: 50px;
      border: 1px solid #d9d9d9;
      border-radius: 8px;
    }
  }
  & .ant-form-item:last-of-type {
    margin-top: ${({ formLayout }) => (formLayout === 'inline' ? '0px' : '50px')};
    margin-bottom: 0;
  }
  & .ant-form-item[data-active="active"]::before {
    top: 4px;
    color: #1890ff;
    font-size: 12px;
  }
  & .ant-form-item-children-icon {
    display: none;
  }
  & .ant-btn {
    min-width: 100px;
    height: 50px;
    font-size: 18px;
  }

  @media screen and (max-width: 767px) {
    display: ${({ formLayout }) => (formLayout === 'inline' ? 'none' : 'block')};
  }
`;

export const PostFormWrapper = styled.div`
  padding: 30px 20px;
  border-bottom: ${({ popup }) => (popup ? 'none' : '5px solid #e0e0e0')};
  background-color: #fff;

  & > .ant-row {
    & > .ant-col:first-child {
      text-align: center;
      padding-top: 8px;
    }
    & > .ant-col:last-child {
      float: right;
      box-sizing: border-box;
    }
    .ant-form {
      .ant-row:nth-child(1) {
        width: 100%;
      }
      .ant-row:nth-child(3) {
        position: absolute;
        width: 5%;
        right: calc(18% + 3px);
        bottom: 8px;
      }
      .ant-row:nth-child(4) {
        width: 20%;
        margin-left: 80%;
      }
    }
  }
  .ant-form-item {
    margin-bottom: 0;
  }
  .ant-input {
    min-height: 60px;
    padding: 20px 15px;
    border: none;
    border-bottom: 1px solid #eee;
    font-size: 20px;
    background-color: transparent;
    box-shadow: none;
  }
  .anticon-file-image {
    transform: translateY(15px);
    color: #1890ff;
    font-size: 24px;
    vertical-align: middle;
  }
  .btn-post {
    width: 100%;
    padding: 0;
    transform: translateY(10px);
  }

  @media screen and (max-width: 767px) {
    & > .ant-row {
      & > .ant-col:first-child {
        padding-top: 12px;
      }
    }
  }
`;

export const ImagePreviewWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  
  &.main {
    display: ${({ showImagesPreview }) => (showImagesPreview ? 'flex' : 'none')};
  }
  .imagePreview {
    position: relative;
    height: 200px;
    flex: 1 1 48%;
    margin: 10px 1%;
    overflow: hidden;
    border-radius: 20px;
    background-color: #eee;

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 50%;
      left: 50%;
      inset: 0px;
      transform: translate(-50%, -50%);
      opacity: 0;
      z-index: -1;
    }
  }
  .ant-btn {
    position: absolute;
    top: 10px;
    left: 10px;
  }
`;

export const SignUpFormWrapper = styled.div`
  position: relative;
  height: 100%;

  .contents {
    position: absolute;
    width: calc(100% - 160px);
    transform: translateY(-50%);
    top: 50%;
    left: 80px;
  }

  .ant-form-item {
    position: relative;
    margin-bottom: 24px;

    &::before {
      content: attr(data-title);
      position: absolute;
      padding: 0 6px;
      top: 11px;
      left: 5px;
      color: #bbb;
      font-size: 18px;
      transition: 400ms all;
      z-index: 0;
    }
    input {
      padding: 21px 11px 2px;
      box-sizing: border-box;
      border: none;
      border-radius: 8px;
      background-color: transparent !important;
      z-index: 10;
    }
  }
  .ant-form-item:nth-child(-n+4) {
    .ant-form-item-control-input {
      height: 50px;
      border: 1px solid #d9d9d9;
      border-radius: 8px;
    }
  }
  .ant-form-item:last-of-type {
    margin-top: 50px;
    margin-bottom: 0;
  }
  .ant-form-item[data-active="active"]::before {
    top: 4px;
    color: #1890ff;
    font-size: 12px;
  }
  .ant-form-item-has-error[data-active="active"]::before {
    color: #ff4d4f;
  }
  .ant-btn {
    height: 50px;
    min-width: 100px;
  }

  @media screen and (max-width: 767px) {
    .ant-form-item {
      margin-bottom: 12px;
    }
    .ant-form-item:last-of-type {
    margin-top: 30px;
    }
  }
`;
