import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Upload, Button, message } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  AudioOutlined,
} from "@ant-design/icons";

const { Dragger } = Upload;

const AudioUploadComponent = forwardRef(({ setSelectedAudio }, ref) => {
  const [fileList, setFileList] = useState([]);
  const [audioSrc, setAudioSrc] = useState(null);

  const props = {
    accept: ".mp3",
    beforeUpload: (file) => {
      const isMp3 = file.type === "audio/mpeg";
      if (!isMp3) {
        message.error(`${file.name} is not a mp3 file`);
      }
      return isMp3 || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      const { file, fileList } = info;
      if (file.status === "done") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAudioSrc(e.target.result);
          setSelectedAudio(file.originFileObj);
        };
        reader.readAsDataURL(file.originFileObj);
      } else if (file.status === "removed") {
        setAudioSrc(null);
        setSelectedAudio(null);
      }
      setFileList(fileList.slice(-1)); // Chỉ giữ lại file mới nhất
    },
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    },
    onRemove: () => {
      setAudioSrc(null);
      setSelectedAudio(null);
    },
    fileList,
  };

  const clearImages = () => {
    setFileList([]);
    setAudioSrc(null);
    setSelectedAudio(null);
  };

  useImperativeHandle(ref, () => ({
    clearImages,
  }));

  return (
    <div>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <AudioOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single upload. Only mp3 files are supported.
        </p>
      </Dragger>
      {audioSrc && (
        <div style={{ marginTop: 16 }}>
          <audio controls src={audioSrc} />
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => {
              setFileList([]);
              setAudioSrc(null);
              setSelectedAudio(null);
            }}
            style={{ marginLeft: 16 }}
          >
            Remove Audio
          </Button>
        </div>
      )}
    </div>
  );
});

export default AudioUploadComponent;
