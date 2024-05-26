import { Table, message, Spin, Modal, Input, Select } from "antd";
import React, { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { axiosPrivate } from "../../api/axios";
import ImageUploadComponent from "../../components/ImageUploadComponent";
import { formatNumber } from "../../utils/format";

const StoryManagement = () => {
  const [dataSource, setDataSource] = useState([]);
  const [editingStory, setEditingStory] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const onDeleteStory = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this story record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((pre) => {
          return pre.filter((story) => story.id !== record.id);
        });
      },
    });
  };

  const onEditStory = (record) => {
    setIsEditing(true);
    setEditingStory({ ...record });
    console.log(record);
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingStory(null);
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
          title="Update Story"
          open={isEditing}
          okText="Save"
          onCancel={() => {
            resetEditing();
          }}
          onOk={() => {
            setDataSource((pre) => {
              return pre.map((story) => {
                if (story.id === editingStory.id) {
                  return editingStory;
                } else {
                  return story;
                }
              });
            });
            resetEditing();
            fetchAllStory();
          }}
          style={{ top: "50px" }}
        >
          <div className="update-story-item-popup">
            <div style={{ width: "100px" }}>Title: </div>
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
            <div style={{ width: "100px" }}>Other title: </div>
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
            <div style={{ width: "100px" }}>Current chapter: </div>
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
            <div style={{ width: "100px" }}>Author: </div>
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
            <div style={{ width: "100px" }}>Status: </div>
            <Select
              // defaultValue={3}
              style={{ width: "100%" }}
              onChange={(value) => {
                if (value === 1) {
                  setEditingStory((pre) => {
                    return { ...pre, status: "Đã hoàn thành", statusId: value };
                  });
                } else if (value === 2) {
                  setEditingStory((pre) => {
                    return {
                      ...pre,
                      status: "Đang tiến hành",
                      statusId: value,
                    };
                  });
                } else if (value === 3) {
                  setEditingStory((pre) => {
                    return { ...pre, status: "Tạm dừng", statusId: value };
                  });
                }
              }}
              options={[
                { value: 1, label: "Đã hoàn thành" },
                { value: 2, label: "Đang tiến hành" },
                { value: 3, label: "Tạm dừng" },
              ]}
            />
          </div>

          <div className="update-story-item-popup">
            <div style={{ width: "100px" }}>Summary: </div>
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
            <div style={{ width: "100px" }}>Loại truyện: </div>
            <Select
              style={{ width: "100%" }}
              onChange={(value) => {
                if (value === 1) {
                  setEditingStory((pre) => {
                    return { ...pre, type: "Truyện tranh", typeId: value };
                  });
                } else if (value === 2) {
                  setEditingStory((pre) => {
                    return { ...pre, type: "Truyện chữ", typeId: value };
                  });
                } else if (value === 3) {
                  setEditingStory((pre) => {
                    return { ...pre, type: "Audio", typeId: value };
                  });
                }
              }}
              options={[
                { value: 1, label: "Truyện tranh" },
                { value: 2, label: "Truyện chữ" },
                { value: 3, label: "Audio" },
              ]}
            />
          </div>

          <div className="update-story-item-popup">
            <div style={{ width: "85px" }}>Loại truyện: </div>
            <ImageUploadComponent setSelectedImage={setSelectedImage} />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default StoryManagement;
