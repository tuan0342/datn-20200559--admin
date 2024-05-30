import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Upload, Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const ImageUploadComponent = forwardRef(({ setSelectedImage }, ref) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleChange = async ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      const latestFile = fileList[fileList.length - 1];
      if (!latestFile.url && !latestFile.preview) {
        latestFile.preview = await getBase64(latestFile.originFileObj);
      }
      setSelectedImage(latestFile);
    } else {
      setSelectedImage(null);
    }
  };

  const clearImages = () => {
    setFileList([]);
    setSelectedImage([]);
  };

  useImperativeHandle(ref, () => ({
    clearImages,
  }));

  return (
    <div>
      <Upload
        accept="image/*"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={() => false}
      >
        {fileList.length >= 1 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
      <Modal
        open={previewVisible}
        title="Preview Image"
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
});

export default ImageUploadComponent;
