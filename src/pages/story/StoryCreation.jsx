import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  Modal,
  Layout,
  Typography,
  Spin,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { axiosPrivate } from "../../api/axios";

const { Header, Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const StoryCreation = () => {
  const [genres, setGenres] = useState([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(false);
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const fetchAllGenres = async () => {
    setIsLoadingGenres(true);
    try {
      const { userToken, user } = JSON.parse(localStorage.getItem("user_data"));
      const { data } = await axiosPrivate.get("story/all_genres_2", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (data.code === 1000) {
        setGenres(data.data);
      } else {
        console.log("Load genres failed");
      }
      setIsLoadingGenres(false);
    } catch (error) {
      setIsLoadingGenres(false);
      console.log(error);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleChange = async ({ fileList }) => {
    setFileList(fileList.slice(-1));
    if (fileList.length > 0) {
      const latestFile = fileList[fileList.length - 1];
      if (!latestFile.url && !latestFile.preview) {
        latestFile.preview = await getBase64(latestFile.originFileObj);
      }
      setSelectedImage(latestFile);
    } else {
      console.log(1);
      setSelectedImage(null);
    }
  };

  useEffect(() => {
    fetchAllGenres();
  }, []);

  const handleSubmit = async (values) => {
    if (selectedImage === null || selectedImage === undefined) {
      message.error("Vui lòng chọn ảnh bìa cho truyện!");
      return;
    }

    const formData = new FormData();
    for (const key in values) {
      if (key === "genres") {
        formData.append("genres", JSON.stringify(values.genres));
      } else if (key === "cover") {
        formData.append(key, fileList[0].originFileObj);
      } else {
        formData.append(key, values[key]);
      }
    }

    try {
      const { userToken, user } = JSON.parse(localStorage.getItem("user_data"));
      const response = await axiosPrivate.post(`story/create`, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.code === 1000) {
        message.success("Tạo truyện thành công");
        form.resetFields();
        setFileList([]);
        setSelectedImage(null);
        setPreviewImage("");
      } else {
        message.error("Xảy ra lỗi. Vui lòng thử lại");
      }
    } catch (error) {
      message.error("Xảy ra lỗi. Vui lòng thử lại");
      console.log(error);
    }
  };

  return (
    <Layout className="layout-story-creation">
      <Header
        style={{ alignItems: "center", display: "flex", background: "white" }}
      >
        <Title level={3} style={{ color: "black" }}>
          Tạo truyện mới
        </Title>
      </Header>
      <Content className="site-layout-content">
        {isLoadingGenres ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please input the title!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="otherTitle"
              label="Other Title"
              rules={[{ message: "Please input the other title!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="author"
              label="Author"
              rules={[{ required: true, message: "Please input the author!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="summary"
              label="Summary"
              rules={[{ message: "Please input the summary!" }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="typeId"
              label="Type"
              rules={[{ required: true, message: "Please select the type!" }]}
            >
              <Select>
                <Option value={1}>Truyện tranh</Option>
                <Option value={2}>Truyện chữ</Option>
                <Option value={3}>Audio</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="cover"
              label="Cover"
              valuePropName="file"
              rules={[{ required: true, message: "Please select cover!" }]}
              // getValueFromEvent={(e) => e.fileList[0]}
            >
              <Upload
                name="cover"
                listType="picture"
                fileList={fileList}
                beforeUpload={() => false}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="genres"
              label="Genres"
              rules={[{ required: true, message: "Please select the genres!" }]}
            >
              <Select mode="multiple">
                {genres.map((genre, index) => (
                  <Option key={index} value={genre.value}>
                    {genre.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
            <Modal
              open={previewVisible}
              title="Preview Image"
              footer={null}
              onCancel={() => setPreviewVisible(false)}
            >
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </Form>
        )}
      </Content>
    </Layout>
  );
};

export default StoryCreation;
