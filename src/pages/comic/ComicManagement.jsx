import React, { useState, useEffect, useRef } from "react";
import { Table, message, Spin, Modal, Input, Form, Space, Button } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { axiosPrivate } from "../../api/axios";
import moment from "moment";

const ComicManagement = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);

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
        `comic/delete/${record.storyId}/${record.chapter}`,
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

  const showModal = (images) => {
    const sortedImages = images.sort(
      (a, b) => a.ordinalNumber - b.ordinalNumber
    );
    setCurrentImages(sortedImages);
    setCurrentImageIndex(0);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? currentImages.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === currentImages.length - 1 ? 0 : prevIndex + 1
    );
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
      width: "20%",
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
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="image-container" onClick={() => showModal(images)}>
            <img src={images[0].image} alt="Image" className="thumbnail" />
            <div className="overlay">{images.length}+</div>
          </div>
        </div>
      ),
      width: "13%",
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
      const { data } = await axiosPrivate.get("story/list/comic_chapter", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (data.code === 1000) {
        const updatedData = data.data.map((story) => ({
          ...story,
          images: story.images.map((img) => ({
            ...img,
            image: `http://localhost:5000${img.image}`,
          })),
        }));
        setDataSource(updatedData);
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
        <Modal
          open={isModalVisible}
          footer={null}
          onCancel={handleCancel}
          style={{ textAlign: "center" }}
        >
          <div style={{ marginBottom: 10 }}>
            {currentImageIndex + 1} / {currentImages.length}
          </div>
          <img
            src={currentImages[currentImageIndex]?.image}
            alt="Current"
            style={{ width: "100%" }}
          />
          <div style={{ marginTop: 10 }}>
            <Button onClick={handlePrev}>Previous</Button>
            <Button onClick={handleNext} style={{ marginLeft: 10 }}>
              Next
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ComicManagement;
