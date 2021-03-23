import styled from 'styled-components';

export const AppLayoutWrapper = styled.div`
  & > .ant-row {
    & > .ant-col:first-child,
    & > .ant-col:last-child {
      position: fixed;
      width: 33.33333333%;
      height: 100vh;
      padding: 30px;
    }
    & > .ant-col:first-child {
      left: 0;
      border-right: 1px solid #f0f0f0;
    }
    & > .ant-col:nth-child(2) {
      width: 33.33333333%;
      min-width: 530px;
      min-height: 100vh;
      margin-left: 33.33333333%;
      padding-top: 60px;
      border-right: 1px solid #f0f0f0;
      transition: .2s all;
    }
    & > .ant-col:last-child {
      right: 0;
      margin: 0;
      background-color: #fff;
      vertical-align: middle;

      .ant-input-group-wrapper {
        display: block;
        width: 100%;
        font-size: 0;
      }
      .ant-input-affix-wrapper {
        width: 50%;
        height: 50px;
        border-radius: 25px;
        padding: 0 11px;
      }
      .anticon-search {
        font-size: 18px;
        color: #bfbfbf;
      }
      .ant-input {
        font-size: 18px;
      }
      .ant-card {
        width: 50%;
        height: 100px;
        margin-bottom: 30px;
        border-radius: 50px;
      }
      .ant-card:hover {
        background-color: #f0f0f0;
        cursor: pointer;
      }
      .ant-card-body {
        position: relative;
      }
      .ant-card-meta-avatar {
        padding-right: 10px;
      }
      .anticon-ellipsis {
        position: absolute;
        top: 24px;
        right: 24px;
      }
    }
    .ant-menu {
      position: absolute;
      width: 50%;
      min-width: 200px;
      height: 100%;
      top: 30px;
      right: 30px;
      border: none;
    }
    .ant-menu-item {
      height: 50px;
      font-size: 22px;
      text-align: left;
      line-height: 50px;

      &:nth-child(2) {
        color: ${({ isHome }) => isHome && '#1890ff'};
        a {
          color: ${({ isHome }) => isHome && '#1890ff'}
        }
      }
      &:nth-child(3) {
        color: ${({ isProfile }) => isProfile && '#1890ff'};
        a {
          color: ${({ isProfile }) => isProfile && '#1890ff'};
        }
      }
      &:last-child {
        height: 54px;
        margin-top: 60px;
        padding: 0;
      }
      .postBtn {
        width: 100%;
        height: 50px;
        font-size: 18px;
      }
      .postBtn .anticon-send {
        display: none;
      }
    }
    .ant-menu-item-icon {
      font-size: 24px;
    }
    .ant-menu-item:first-child {
      height: 100px;
      line-height: 100px;
      text-align: center;

      .anticon-message {
        color: #1890ff;
        font-size: 50px;
      }
    }
    .ant-menu-item:nth-child(4), .ant-menu-item:nth-child(5) {
      display: none;
    }
    .ant-menu-item-selected {
      background-color: #fff;
    }
    .ant-input-group-addon {
      display: none;
    }
  }

  @media screen and (max-width: 1599px) {
    .ant-row {
      .ant-menu-item:nth-child(4) {
        display: block;
        height: 80px;
        padding: 0;

        .ant-input-group-wrapper {
          display: block;
          width: 100%;
          font-size: 0;
        }
        .ant-input-affix-wrapper {
          width: 100%;
          height: 50px;
          padding: 0 11px;
          border-radius: 25px;
        }
        .anticon-search {
          color: #bfbfbf;
          font-size: 18px;
        }
        .ant-input {
          font-size: 18px;
        }
      }
      .ant-menu-item:nth-child(5) {
        display: block;
        height: 100px;
        padding: 0;

        .ant-card {
          width: 100%;
          height: 100px;
          margin-bottom: 30px;
          border-radius: 50px;
        }
        .ant-card:hover {
          background-color: #f0f0f0;
          cursor: pointer;
        }
        .ant-card-body {
          position: relative;
        }
        .ant-card-meta-avatar {
          padding-right: 10px;
        }
        .anticon-user {
          font-size: 24px;
        }
        .anticon-ellipsis {
          position: absolute;
          top: 24px;
          right: 24px;
        }
      }
    }
  }

  @media screen and (max-width: 767px) {
    width: 100%;

    & > .ant-row {
      & > .ant-col:first-child {
        width: 100%;
        min-width: 100%;
        height: 60px;
        padding: 10px;
        box-sizing: border-box;
        border-right: none;
        bottom: 0;
        z-index: 9999;
      }
      & > .ant-col:nth-child(2) {
        width: 100%;
        min-width: 100%;
        min-height: 0;
        margin-left: 0;
        padding-bottom: 60px;
        box-sizing: border-box;
        overflow: hidden;
      }
      .ant-menu {
        position: absolute;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 60px;
        border-top: 1px solid #f0f0f0;
        top: 0;
        left: 0;
      }
      .ant-menu-item {
        width: 60px;
        height: 60px !important;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-size: 0;
        line-height: 60px;
        text-align: center;

        &:first-child {
          display: none;
        }
        &:nth-child(2),
        &:nth-child(3) {
          width: 50px;
          margin: 0
        }
        &:nth-child(4) {
          width: 170px;
          padding-top: 24px;
          margin: 0 10px;

          .ant-input-affix-wrapper {
            height: 42px;
            transform: translateY(-15px);
          }
        }
        &:nth-child(5) {
          background-color: transparent;

          .ant-card {
            width: 42px;
            height: 42px;
            margin: 9px 5px;
            border-radius: 50%;
          }
          .ant-card .ant-card-body {
            padding: 0;
          }
          .ant-card .anticon-ellipsis {
            display: none;
          }
          .ant-card .ant-card-meta-avatar {
            padding: 0;
          }
          .anticon-user {
            font-size: 18px;
          }
        }
        &:last-child {
          margin-top: 0;
        }
        
        .postBtn {
          width: 42px;
          height: 42px;
          padding: 9px 10px;
          margin: 9px 5px;

          & > span {
            font-size: 0;
          }
        }
        .postBtn .anticon-send {
          display: inline-block;
          font-size: 22px;
        }
      }
      .ant-menu-item-icon {
        font-size: 24px;
        margin: 18px 15px;
      }
      .ant-menu-item-selected {
        background-color: #fff;
      }
    }
  }
`;

export const IndexLayoutWrapper = styled.div`
  main > .ant-row {
    flex-direction: row-reverse;

    & > .ant-col {
      height: 100vh;
    }
  }

  @media screen and (max-width: 767px) {
    text-align: center;

    main > .ant-row {
      flex-direction: column;

      & > .ant-col:first-child {
        height: 50vh;
        min-height: 450px;
      }
      & > .ant-col:last-child {
        height: calc(100vh - 450px);
      }
    }
  }
`;

export const IndexContentsWrapper = styled.div`
  height: 100%;
`;

export const IndexBackGround = styled.div`
  height: 100%;
  background: url('http://snsbyjg.website/images/bg_index.jpg') no-repeat center / cover;
`;
