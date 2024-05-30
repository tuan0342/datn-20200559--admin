import React, { useState, useEffect, useRef } from "react";
import { Table, message, Spin, Modal, Input, Form, Space, Button } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { axiosPrivate } from "../../api/axios";
import moment from "moment";
import ContentPreview from "../../components/ContentPreview";

const NovelManagement = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentContent, setCurrentContent] = useState("");

  const showModal = (content) => {
    const formattedContent = content.replace(/\\n|\/n/g, "\n");
    setCurrentContent(formattedContent);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onDeleteChapter = (record) => {
    Modal.confirm({
      title: "Bạn có muốn xóa vĩnh viễn chương này không?",
      okText: "Có",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        onOkDelete(record);
      },
    });
  };

  const onOkDelete = async (record) => {
    try {
      const { userToken, user } = JSON.parse(localStorage.getItem("user_data"));
      const response = await axiosPrivate.delete(
        `lightnovel/delete/${record.storyId}/${record.chapter}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.data.code === 1000) {
        message.success(
          `Đã xóa chương ${record.chapter} của truyện ${record.title} thành công`
        );
        fetchAllStory();
      } else {
        message.error("Xảy ra lỗi. Vui lòng thử lại");
      }
    } catch (error) {
      console.error("Error delete record", error);
      message.error("Xảy ra lỗi.");
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
      title: "Story ID",
      dataIndex: "storyId",
      key: "storyId",
      width: "10%",
      render: (text) => (
        <div style={{ textAlign: "center", fontSize: 16 }}>{text}</div>
      ),
      ...getColumnSearchProps("storyId"),
    },
    {
      title: "Story Title",
      dataIndex: "title",
      key: "title",
      width: "15%",
      render: (text) => (
        <div style={{ textAlign: "center", fontSize: 16 }}>{text}</div>
      ),
      ...getColumnSearchProps("title"),
    },
    {
      title: "Chapter Title",
      dataIndex: "titleChapter",
      key: "titleChapter",
      width: "15%",
      render: (text) => (
        <div style={{ textAlign: "center", fontSize: 16 }}>{text}</div>
      ),
    },
    {
      title: "Chapter",
      dataIndex: "chapter",
      key: "chapter",
      width: "12%",
      render: (text) => (
        <div style={{ textAlign: "center", fontSize: 16 }}>{text}</div>
      ),
      ...getColumnSearchProps("chapter"),
    },
    {
      title: "Contents",
      dataIndex: "contents",
      key: "contents",
      render: (text) => (
        <div>
          <div className="custom-cell-long-text">{text}</div>
          <Button
            type="link"
            style={{ color: "blue", padding: 0 }}
            onClick={() => showModal(text)}
          >
            xem thêm
          </Button>
        </div>
      ),

      width: "20%",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => (
        <div style={{ textAlign: "center", fontSize: 16 }}>
          {moment(parseInt(text, 10)).format("HH:mm:ss, DD/MM/YYYY")}
        </div>
      ),
      width: "20%",
      sorter: (a, b) =>
        parseInt(a.createdDate, 10) - parseInt(b.createdDate, 10),
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      render: (record) => {
        return (
          <div style={{ textAlign: "center" }}>
            <DeleteOutlined
              onClick={() => {
                onDeleteChapter(record);
              }}
              style={{ color: "red", marginLeft: 12, fontSize: 20 }}
            />
          </div>
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
      const { data } = await axiosPrivate.get("story/list/lightnovel_chapter", {
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
            rowKey={(record) => record.id}
          ></Table>
        )}
      </div>
      <Modal
        title="Full Content"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ whiteSpace: "pre-wrap", lineHeight: "20px" }}>
          {currentContent.split("\n").map((paragraph, index) => (
            <p key={index} style={{ marginBottom: "15px" }}>
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default NovelManagement;
