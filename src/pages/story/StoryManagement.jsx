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
} from "@ant-design/icons";
import { axiosPrivate } from "../../api/axios";
import ImageUploadComponent from "../../components/ImageUploadComponent";
import { formatNumber } from "../../utils/format";

const StoryManagement = () => {
  const [dataSource, setDataSource] = useState([]);
  const [editingStory, setEditingStory] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedStatusId, setSelectedStatusId] = useState(null);
  const [selectedTypeStoryId, setSelectedTypeStoryId] = useState(null);

  const onDeleteStory = (record) => {
    Modal.confirm({
      title: "Bạn có muốn xóa truyện này không?",
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
      // const response = await axiosPrivate.delete(`story/delete/${record.id}`, {
      //   headers: {
      //     Authorization: `Bearer ${userToken}`,
      //   },
      // });
      const response = await axiosPrivate.delete(
        `story/delete_soft/${record.id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.data.code === 1000) {
        message.success("Đã xóa truyện thành công");
        setDataSource((pre) => {
          return pre.filter((story) => story.id !== record.id);
        });
      } else {
        message.error("Xảy ra lỗi. Vui lòng thử lại");
      }
    } catch (error) {
      console.error("Error delete record", error);
      message.error("Xảy ra lỗi.");
    }
  };

  const onEditStory = (record) => {
    setSelectedStatusId(record.statusId);
    setSelectedTypeStoryId(record.typeId);
    setIsEditing(true);
    setEditingStory({ ...record });
  };

  const onOkEditStory = async () => {
    const formData = new FormData();
    if (editingStory.title) {
      formData.append("title", editingStory.title);
    }
    if (editingStory.otherTitle) {
      formData.append("otherTitle", editingStory.otherTitle);
    }
    if (editingStory.currentChapter) {
      formData.append("currentChapter", editingStory.currentChapter);
    }
    if (editingStory.author) {
      formData.append("author", editingStory.author);
    }
    if (selectedStatusId) {
      formData.append("statusId", selectedStatusId);
    }
    if (editingStory.summary) {
      formData.append("summary", editingStory.summary);
    }
    if (selectedTypeStoryId) {
      formData.append("typeId", selectedTypeStoryId);
    }
    if (selectedImage) {
      formData.append("cover", selectedImage.originFileObj);
    }

    try {
      const { userToken, user } = JSON.parse(localStorage.getItem("user_data"));
      const response = await axiosPrivate.put(
        `story/update/${editingStory.id}`,
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
        message.success("Update successfully");
      } else {
        resetEditing();
        message.error("Update Error");
      }
    } catch (error) {
      console.error("Error uploading the form data", error);
      message.error("Update Error");
    }

    // setDataSource((pre) => {
    //   return pre.map((story) => {
    //     if (story.id === editingStory.id) {
    //       return editingStory;
    //     } else {
    //       return story;
    //     }
    //   });
    // });
  };

  const resetEditing = () => {
    setSelectedTypeStoryId(null);
    setSelectedStatusId(null);
    setIsEditing(false);
    setEditingStory(null);
    setSelectedImage(null);
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
            <EditOutlined
              style={{ fontSize: 20 }}
              onClick={() => {
                onEditStory(record);
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
      const { data } = await axiosPrivate.get("story/list", {
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
          title="Cập nhật truyện"
          open={isEditing}
          okText="Lưu"
          cancelText="Hủy"
          onCancel={() => {
            resetEditing();
          }}
          onOk={onOkEditStory}
          afterClose={() => {
            setSelectedStatusId(undefined);
            setSelectedTypeStoryId(undefined);
          }}
          style={{ top: "50px" }}
        >
          <div className="update-story-item-popup">
            <div style={{ width: "100px" }}>Tiêu đề: </div>
            <Input
              value={editingStory?.title}
              onChange={(e) => {
                setEditingStory((pre) => {
                  return { ...pre, title: e.target.value };
                });
              }}
            />
          </div>

          <div className="update-story-item-popup">
            <div style={{ width: "100px" }}>Tên khác: </div>
            <Input
              value={editingStory?.otherTitle}
              onChange={(e) => {
                setEditingStory((pre) => {
                  return { ...pre, otherTitle: e.target.value };
                });
              }}
            />
          </div>

          <div className="update-story-item-popup">
            <div style={{ width: "100px" }}>Chương hiện tại: </div>
            <Input
              value={editingStory?.currentChapter}
              onChange={(e) => {
                setEditingStory((pre) => {
                  return { ...pre, currentChapter: e.target.value };
                });
              }}
            />
          </div>

          <div className="update-story-item-popup">
            <div style={{ width: "100px" }}>Tác giả: </div>
            <Input
              value={editingStory?.author}
              onChange={(e) => {
                setEditingStory((pre) => {
                  return { ...pre, author: e.target.value };
                });
              }}
            />
          </div>

          <div className="update-story-item-popup">
            <div style={{ width: "100px" }}>Trạng thái: </div>
            <Select
              defaultValue={selectedStatusId}
              style={{ width: "100%" }}
              onChange={(value) => {
                setSelectedStatusId(value);
                // setEditingStory((pre) => {
                //   return { ...pre, status: "Đã hoàn thành", statusId: value };
                // });
              }}
              options={[
                { value: 1, label: "Đã hoàn thành" },
                { value: 2, label: "Đang tiến hành" },
                { value: 3, label: "Tạm dừng" },
              ]}
            />
          </div>

          <div className="update-story-item-popup">
            <div style={{ width: "100px" }}>Tóm tắt: </div>
            <Input.TextArea
              value={editingStory?.summary}
              rows={4}
              onChange={(e) => {
                setEditingStory((pre) => {
                  return { ...pre, summary: e.target.value };
                });
              }}
            />
          </div>

          <div className="update-story-item-popup">
            <div style={{ width: "100px" }}>Loại truyện:</div>
            <Select
              defaultValue={selectedTypeStoryId}
              style={{ width: "100%" }}
              onChange={(value) => {
                setSelectedTypeStoryId(value);
                // setEditingStory((pre) => {
                //   return { ...pre, type: "Truyện tranh", typeId: value };
                // });
              }}
              options={[
                { value: 1, label: "Truyện tranh" },
                { value: 2, label: "Truyện chữ" },
                { value: 3, label: "Audio" },
              ]}
            />
          </div>

          <div className="update-story-item-popup">
            <div style={{ width: "85px" }}>Ảnh bìa: </div>
            <ImageUploadComponent setSelectedImage={setSelectedImage} />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default StoryManagement;
