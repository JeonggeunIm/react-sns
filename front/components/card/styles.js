import styled from 'styled-components';
import { Card } from 'antd';

export const PostCardWrapper = styled.div`
  .ant-card {
    padding: 16px 24px 12px;
    border: none;
    border-bottom: 1px solid #f0f0f0;
    transition: .4s all;
    cursor: pointer;
  }
  .ant-card:hover {
    background-color: #f0f0f0;
  }
  .ant-card-head {
    min-height: auto;
    border-bottom: none;
    color: #666;
    font-size: 14px;
    font-weight: 500;
  }
  .ant-card-body {
    padding: 0;
  }
  .ant-card-head-title {
    padding: 0 0 10px;
  }
  .ant-card-actions {
    margin-left: 56px;
    border-top: none;
    background-color: transparent;
    z-index: 100;

    li {
      border-right: none;
      &:nth-child(1) .anticon::after {
        content: attr(data-length);
      }
      &:nth-child(2) .anticon:not([data-length=""]){
        color: ${({ liked }) => (liked ? '#eb2f96' : 'inherit')};
      }
      &:nth-child(2) .anticon::after {
        content: attr(data-length);
      }
      &:nth-child(3) .anticon::after {
        content: '';
      }
    }
    .anticon {
      text-align: left;
      font-size: 20px;
      line-height: 18px;
    }
    .anticon::after {
      position: absolute;
      margin-left: 5px;
      font-size: 15px;
    }
    .anticon-retweet[aria-label="리포스트 취소"] {
      color: #1890ff;
      font-weight: 700;
    }
  }
  .ant-card-meta {
    padding: 0;
  }
  .ant-card-meta-detail {
    display: flex;
    margin-right: 0;

    .ant-card-meta-title {
      margin-bottom: 0;
      font-size: 18px;
    }
    .ant-card-meta-title a {
      color: inherit;
      &:hover {
        text-decoration: underline;
      }
    }
    .ant-card-meta-description {
      height: 100%;
      margin-left: 5px;
      line-height: 28px;

      span {
        display: inline-block;
        margin-left: 15px;
      }
    }
  }
  .ant-list-items {
    padding: 5px 0;
  }
  .ant-list-split .ant-list-item {
    padding: 12px 50px;
  }
  .ant-list-split .ant-list-header {
    border-bottom: none;
  }
  .ant-comment-content-author > span {
    font-size: 15px;
    
    span:first-child {
      font-size: 17px;
      color: #666;
    }
    span:nth-child(n+2) {
      padding-left: 8px;
    }
  }
  .ant-comment-content-detail {
    font-size: 18px;
  }
  .ant-comment-avatar img {
    width: 100%;
    height: 100%;
  }
  .ant-empty-normal {
    display: none;
  }
`;

export const ProfileCardWrapper = styled(Card)`
  border-bottom: 5px solid #e0e0e0;

  .ant-card-head {
    position: absolute;
    border-bottom: none;
    top: 180px;
    right: 0;
    z-index: 10;
  }
  .ant-card-cover {
    position: relative;
    height: 180px;
    overflow: hidden;
    background-color: #f0f0f0;

    .ant-btn {
      position: absolute;
      width: 40px;
      height: 40px;
      border: none;
      top: 125px;
      right: 30px;
      background-color: #888;
      opacity: .8;
    }
    .anticon-edit {
      display: inline-block;
      width: auto;
      color: #fff;
      font-size: 26px;
    }
  }
  .ant-card-extra {
    button {
      height: 45px;
      font-size: 15px;
    }
  }
  .ant-card-body {
    position: relative;
    padding: 80px 30px 30px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 16px;

    .number {
      margin-top: 12px;
      span {
        margin-right: 10px;
      }
    }
    em {
      color: #333;
      font-style: normal;
      font-weight: 600;
    }
  }
  .ant-card-meta-avatar {
    position: absolute;
    top: -75px;
    left: 30px;
  }
  .ant-avatar {
    border: 3px solid #fff;
  }
  .ant-card-meta-title {
    font-size: 22px;
  }
  .ant-card-meta-description {
    margin-bottom: 12px;
    font-size: 16px;
  }
  .ant-card-meta-detail > div:not(:last-child) {
    margin-bottom: 0;
  }
  .ant-avatar-image {
    background-color: #fff;
  }
`;

export const UserProfileWrapper = styled.div`
`;
