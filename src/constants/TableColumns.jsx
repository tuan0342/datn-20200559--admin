import { Table, message, Spin } from "antd";
import React from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export const storyColumns = [
  {
    title: "Story Id",
    dataIndex: "id",
    key: "id",
    width: "7%",
    sorter: (a, b) => a.id - b.id,
    defaultSortOrder: "ascend",
    render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: "13%",
  },
  {
    title: "Other Title",
    dataIndex: "otherTitle",
    key: "otherTitle",
    width: "10%",
  },
  {
    title: "Current Chapter",
    dataIndex: "currentChapter",
    key: "currentChapter",
    width: "8%",
    render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
  },
  {
    title: "Author",
    dataIndex: "author",
    key: "author",
    width: "10%",
    render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    filters: [
      {
        text: "Đã hoàn thành",
        value: "Đã hoàn thành",
      },
      {
        text: "Đang tiến hành",
        value: "Đang tiến hành",
      },
      {
        text: "Tạm dừng",
        value: "Tạm dừng",
      },
    ],
    onFilter: (value, record) => record.status.indexOf(value) === 0,
    width: "10%",
    render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
  },
  {
    title: "View",
    dataIndex: "view",
    key: "view",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.view - b.view,
    width: "8%",
    render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
  },
  {
    title: "Summary",
    dataIndex: "summary",
    key: "summary",
    render: (text) => <div className="custom-cell-long-text">{text}</div>,
    width: "18%",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: "8%",
    filters: [
      {
        text: "Truyện tranh",
        value: "Truyện tranh",
      },
      {
        text: "Truyện chữ",
        value: "Truyện chữ",
      },
      {
        text: "Audio",
        value: "Audio",
      },
    ],
    onFilter: (value, record) => record.type.indexOf(value) === 0,
    render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
  },
  {
    title: "Actions",
    key: "actions",
    width: "7%",
    render: (record) => {
      return (
        <>
          <EditOutlined style={{ fontSize: 20 }} />
          <DeleteOutlined
            onClick={() => {
              onDeleteStory(record);
            }}
            style={{ color: "red", marginLeft: 12, fontSize: 20 }}
          />
        </>
      );
    },
  },
];
