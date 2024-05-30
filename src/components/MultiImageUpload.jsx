import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Upload, Modal, Button, Carousel } from "antd";
import { PlusOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const MultiImageUpload = forwardRef(({ setSelectedImage }, ref) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [fileList, setFileList] = useState([]);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = (index) => {
    setPreviewImageIndex(index);
    setPreviewVisible(true);
  };

  const handleChange = async ({ fileList }) => {
    for (let file of fileList) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
    }
    setFileList(fileList);
    setSelectedImage(fileList);
  };

  const clearImages = () => {
    setFileList([]);
    setSelectedImage([]);
  };

  useImperativeHandle(ref, () => ({
    clearImages,
  }));

  const nextImage = () => {
    setPreviewImageIndex((prevIndex) => (prevIndex + 1) % fileList.length);
  };

  const prevImage = () => {
    setPreviewImageIndex(
      (prevIndex) => (prevIndex - 1 + fileList.length) % fileList.length
    );
  };

  return (
    <div>
      <Upload
        accept="image/*"
        listType="picture-card"
        fileList={fileList}
        onPreview={(file) => handlePreview(fileList.indexOf(file))}
        onChange={handleChange}
        beforeUpload={() => false}
        multiple
      >
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      </Upload>
      <Modal
        open={previewVisible}
        title="Preview Image"
        footer={null}
        onCancel={handleCancel}
        centered
      >
        {fileList.length > 0 && (
          <>
            <img
              alt="example"
              style={{ width: "100%" }}
              src={
                fileList[previewImageIndex].url ||
                fileList[previewImageIndex].preview
              }
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Button
                icon={<LeftOutlined />}
                onClick={prevImage}
                disabled={fileList.length <= 1}
              >
                Previous
              </Button>
              <Button
                icon={<RightOutlined />}
                onClick={nextImage}
                disabled={fileList.length <= 1}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
});

export default MultiImageUpload;
