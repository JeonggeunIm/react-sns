import { createGlobalStyle } from 'styled-components';

const Global = createGlobalStyle`
  .ir_so {overflow: hidden; position: absolute; width: 0; height: 0; line-height: 0; text-indent: -9999px;}

  .ant-popover {
    z-index: 0;
  }
  .ant-popover-inner-content {
    width: 180px;
    padding: 0;

    .btn-area {
      position: relative;
      width: 100%;
      height: 40px;
      padding: 6px 0;
      box-sizing: border-box;
      line-height: 40px;

      button {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border: none;
        outline: none;
        color: inherit;
        box-shadow: none;
      }
    }
    .btn-area:last-child {
      border-top: 1px solid #f0f0f0;

      button {
        color: #ff0000;
      }
      button.btn-follow {
        border: none;
        background-color: #fff;
      }
    }
  }
  .ant-popover-placement-bottom,
  .ant-popover-placement-top {
    position: fixed;
    width: 20%;
    min-width: 270px;

    .ant-popover-inner {
      border-radius: 15px;

      &-content {
        width: 100%;
        min-width: 177px;
        padding: 0;
      }
      .ant-card {
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
      }
      .ant-card-meta-title {
        font-size: 18px;
      }
      .ant-card-meta-description {
        font-size: 16px;
      }
    }
    .ant-popover-title {
      padding: 0;
    }
    .btn-logout {
      width: 100%;
      height: 100%;
      padding: 15px 30px;
      border: none;
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
      font-size: 16px;
      text-align: left;
    }
  }
  .ant-popover-placement-topLeft > .ant-popover-content > .ant-popover-arrow,
  .ant-popover-placement-topRight > .ant-popover-content > .ant-popover-arrow {
    display: none !important;
  }
  .ant-modal-content {
    border-radius: 20px;
  }
  .ant-modal-header,
  .ant-modal-footer {
    display: none;
  }
  .ant-modal-body {
    padding: 24px 0;
  }

  @media screen and (max-width: 767px) {
    .ant-popover-placement-top {
      width: 100%;
      margin: 0 20px;
    }
    .ant-popover-placement-topRight > .ant-popover-content > .ant-popover-arrow {
      right: 50%;
    }
    .ant-popover-placement-top > .ant-popover-content > .ant-popover-arrow {
      display: none !important;
    }
  }
`;

export default Global;
