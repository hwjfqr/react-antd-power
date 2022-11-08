import { useState, useEffect } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadProps, UploadChangeParam } from 'antd/es/upload/index';

export type FileListType = {
  uid?: string;
  name: string;
  url?: string;
  thumbUrl?: string;
}[];
export interface UploadInFormProps {
  value?: FileListType;
  onChange?: (fileList?: FileListType) => void;
  handleOnChange?: (info: UploadChangeParam) => void;
  uploadProps?: UploadProps;
}
function UploadInForm({
  value,
  onChange,
  handleOnChange,
  uploadProps = {},
}: UploadInFormProps) {
  const [fileList, setFileList] = useState<FileListType | undefined>([]);

  useEffect(() => {
    onChange && onChange(fileList);
  }, [fileList]);

  useEffect(() => {
    setFileList(value);
  }, [value]);

  return (
    <>
      <Upload
        fileList={(fileList || []).map((item, idx) => ({
          uid: String(idx),
          ...item,
        }))}
        onChange={(info) => {
          console.log(info.fileList); // 提取出 url、name、thumbUrl。
          setFileList(info.fileList);
          handleOnChange && handleOnChange(info);
          // if (info.file.status !== 'uploading') {
          //   console.log(info.file, info.fileList);
          // }
          // if (info.file.status === 'done') {
          //   message.success(`${info.file.name} file uploaded successfully`);
          // } else if (info.file.status === 'error') {
          //   message.error(`${info.file.name} file upload failed.`);
          // }
        }}
        {...uploadProps}
      >
        <Button type="link">上传</Button>
      </Upload>
    </>
  );
}

export default UploadInForm;
