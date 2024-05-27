import {
  Table,
  message,
  Spin,
  Modal,
  Input,
  Select,
  Space,
  Button,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { axiosPrivate } from "../../api/axios";
import ImageUploadComponent from "../../components/ImageUploadComponent";
import { formatNumber } from "../../utils/format";

const StoryRecycleBin = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteStory = (record) => {
    Modal.confirm({
      title:
        "Bạn có muốn xóa vĩnh viễn truyện này không? Hành động này sẽ không thể khôi phục truyện",
      okText: "Có",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        onOkDeleteStory(record);
      },
    });
  };

  const onOkDeleteStory = async (record) => {
    try {
      const { userToken, user } = JSON.parse(localStorage.getItem("user_data"));
      const response = await axiosPrivate.delete(`story/delete/${record.id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.code === 1000) {
        message.success("Đã xóa truyện vĩnh viễn");
        setDataSource((pre) => {
          return pre.filter((story) => story.id !== record.id);
        });
      } else {
        message.error("Xảy ra lỗi");
      }
    } catch (error) {
      console.error("Error delete record", error);
      message.error("Xảy ra lỗi");
    }
  };

  const onUndoStory = (record) => {
    Modal.confirm({
      title: "Bạn có muốn khôi phục truyện này không?",
      okText: "Có",
      cancelText: "Hủy",
      onOk: () => {
        onOkUndoStory(record);
      },
    });
  };

  const onOkUndoStory = async (record) => {
    try {
      const { userToken, user } = JSON.parse(localStorage.getItem("user_data"));
      const response = await axiosPrivate.post(
        `story/undo_delete_soft/${record.id}`,
        JSON.stringify({}),
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.data.code === 1000) {
        message.success("Đã khôi phục truyện");
        setDataSource((pre) => {
          return pre.filter((story) => story.id !== record.id);
        });
      } else {
        message.error("Xảy ra lỗi. Vui lòng thử lại");
      }
    } catch (error) {
      console.error("Error delete record", error);
      message.error("Xảy ra lỗi");
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
      }
    },
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const storyColumns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "4%",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "ascend",
      render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
    },
    {
      title: "Cover",
      dataIndex: "cover",
      key: "cover",
      render: (text) => (
        <div className="image-row-table">
          <img
            src={
              typeof text === "string" && text.includes("http")
                ? text
                : `http://localhost:5000${text}`
            }
            alt="Story"
            style={{ width: 60, height: 100 }}
          />
        </div>
      ),
      width: "10%",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "12%",
      ...getColumnSearchProps("title"),
    },
    {
      title: "Other Title",
      dataIndex: "otherTitle",
      key: "otherTitle",
      width: "10%",
      ...getColumnSearchProps("otherTitle"),
    },
    {
      title: "Current Chapter",
      dataIndex: "currentChapter",
      key: "currentChapter",
      width: "13%",
      render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      width: "6%",
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
      width: "8%",
      render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
    },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.view - b.view,
      width: "6%",
      render: (text) => (
        <div style={{ textAlign: "center" }}>{formatNumber(text)}</div>
      ),
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
      width: "6%",
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
            <UndoOutlined
              style={{ fontSize: 20 }}
              onClick={() => {
                onUndoStory(record);
              }}
            />
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

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const fetchAllStory = async () => {
    setIsLoading(true);
    try {
      const { userToken, user } = JSON.parse(localStorage.getItem("user_data"));
      const { data } = await axiosPrivate.get("story/list_delete_soft", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (data.code === 1000) {
        setDataSource(data.data);
      } else {
        message.error("Load data failed");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      message.error(error);
    }
  };

  useEffect(() => {
    fetchAllStory();
  }, []);

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        height: "100%",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <div className="custom-table-container">
        {isLoading ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={storyColumns}
            dataSource={dataSource.map((item) => ({ ...item, key: item.id }))}
            onChange={onChange}
            showSorterTooltip={{
              target: "sorter-icon",
            }}
            scroll={{ scrollToFirstRowOnChange: true, y: 460, x: true }}
            className="custom-table"
            style={{ width: "calc(100% - 10px)" }}
          ></Table>
        )}
      </div>
    </div>
  );
};

export default StoryRecycleBin;
