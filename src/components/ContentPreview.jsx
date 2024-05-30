import React, { useState } from "react";
import { Modal, Button } from "antd";

const ContentPreview = ({ content }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const shortContent = content.split("\n").slice(0, 2).join("\n") + "...";

  const formattedContent = content.split(/\\n|\n/).map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  const formattedShortContent = shortContent
    .split(/\\n|\n/)
    .map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));

  return (
    <>
      <div style={{ whiteSpace: "pre-line", lineHeight: "1.5" }}>
        {formattedShortContent}
        <Button type="link" onClick={showModal} style={{ color: "blue" }}>
          xem thêm
        </Button>
      </div>
      <Modal
        title="Toàn bộ nội dung"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
      >
        <div style={{ whiteSpace: "pre-line", lineHeight: "1.5" }}>
          {formattedContent}
        </div>
      </Modal>
    </>
  );
};

export default ContentPreview;
