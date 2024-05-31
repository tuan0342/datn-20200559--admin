import React, { useState, useEffect, useRef } from "react";
import { Table, message, Spin, Modal, Input, Form, Space, Button } from "antd";
import { SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { axiosPrivate } from "../../api/axios";
import AudioUploadComponent from "../../components/AudioUploadComponent";

const AudioChapterCreation = () => {
  const [dataSource, setDataSource] = useState([]);
  const [editingStory, setEditingStory] = useState(); // audio is selected
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [titleChapter, setTitleChapter] = useState("");
  const [chapter, setChapter] = useState(null);

  const [isSaving, setIsSaving] = useState(false);

  const uploadRef = useRef(null);

  const onCreateChapterStory = (record) => {
    setIsEditing(true);
    setEditingStory({ ...record });
  };

  const onOk = async () => {
    if (!chapter) {
      message.error("Vui lòng nhập số chương muốn đăng!");
      return;
    }
    if (
      selectedImage === null ||
      selectedImage === undefined ||
      selectedImage.length === 0
    ) {
      message.error("Vui lòng chọn ảnh cho chương truyện!");
      return;
    }

    const formData = new FormData();
    formData.append("title", titleChapter ? titleChapter : "");
    formData.append(`audio`, selectedImage);

    setIsSaving(true); // Start loading

    try {
      const { userToken, user } = JSON.parse(localStorage.getItem("user_data"));
      const response = await axiosPrivate.post(
        `audio/chapter/create/${editingStory.id}/${chapter}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.code === 1000) {
        resetEditing();
        fetchAllStory();
        message.success("Thêm chương mới thành công");
      } else {
        resetEditing();
        message.error("Đã xảy ra lỗi. Vui lòng thử lại");
      }
    } catch (error) {
      console.error("Error uploading the form data", error);
      message.error("Thêm chương mới thất bại");
    } finally {
      setIsSaving(false); // Stop loading indicator
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingStory(null);
    setSelectedImage([]);
    setChapter(null);
    setTitleChapter("");
    if (uploadRef.current) {
      uploadRef.current.clearImages();
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

  const getStatusStyle = (text) => {
    switch (text) {
      case "Tạm dừng":
        return { color: "red" };
      case "Đang tiến hành":
        return { color: "blue" };
      case "Đã hoàn thành":
        return { color: "#009E60" };
      default:
        return {};
    }
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
        <div style={{ display: "flex", justifyContent: "center" }}>
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
      width: "20%",
      ...getColumnSearchProps("title"),
    },
    {
      title: "Other Title",
      dataIndex: "otherTitle",
      key: "otherTitle",
      width: "18%",
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
      width: "16%",
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
      width: "12%",
      render: (text) => (
        <div style={{ textAlign: "center", ...getStatusStyle(text) }}>
          {text}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "7%",
      render: (record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlusCircleOutlined
              style={{ fontSize: 20 }}
              onClick={() => {
                onCreateChapterStory(record);
              }}
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
      const { data } = await axiosPrivate.get("story/list/audio", {
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
        <Modal
          title="Đăng chương mới"
          open={isEditing}
          okText="Lưu"
          cancelText="Hủy"
          onCancel={() => {
            resetEditing();
          }}
          onOk={onOk}
          afterClose={() => {}}
          confirmLoading={isSaving}
          style={{ top: "50px" }}
        >
          <div className="update-story-item-popup" style={{ marginTop: 20 }}>
            <div style={{ width: "200px" }}>Tên truyện: </div>
            <div style={{ width: "100%", fontWeight: "bold" }}>
              {editingStory?.title}
            </div>
          </div>
          <div className="update-story-item-popup" style={{ marginTop: 20 }}>
            <div style={{ width: "200px" }}>Chương hiện tại: </div>
            <div style={{ width: "100%", fontWeight: "bold" }}>
              {editingStory?.currentChapter}
            </div>
          </div>
          <div className="update-story-item-popup" style={{ marginTop: 20 }}>
            <div
              style={{
                width: "200px",
                marginBottom: 17,
                display: "flex",
                flexDirection: "row",
              }}
            >
              Chương mới:{" "}
              <div style={{ color: "red", marginLeft: 5 }}>{` (*)`}</div>
            </div>
            <Form
              name="numeric_input_form"
              initialValues={{ number: "" }}
              style={{ height: 50, width: "100%" }}
            >
              <Form.Item
                name="number"
                rules={[
                  {
                    pattern: /^\d*$/,
                    message: "Không được nhập kí tự khác kí tự số",
                  },
                ]}
              >
                <Input
                  placeholder="Nhập số"
                  value={chapter}
                  onChange={(e) => {
                    setChapter(e.target.value);
                  }}
                />
              </Form.Item>
            </Form>
          </div>
          <div className="update-story-item-popup">
            <div style={{ width: "200px" }}>Tiêu đề chương: </div>
            <Input
              value={titleChapter}
              onChange={(e) => {
                setTitleChapter(e.target.value);
              }}
            />
          </div>

          <div className="update-story-item-popup">
            <div
              style={{ width: "200px", display: "flex", flexDirection: "row" }}
            >
              File audio:{" "}
              <div style={{ color: "red", marginLeft: 5 }}>{` (*)`}</div>
            </div>
            <div style={{ width: "100%" }}>
              {/* <MultiImageUpload
                ref={uploadRef}
                setSelectedImage={setSelectedImage}
              /> */}
              <AudioUploadComponent
                ref={uploadRef}
                setSelectedAudio={setSelectedImage}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AudioChapterCreation;
