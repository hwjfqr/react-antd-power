import request from '@/utils/request';
import { message } from 'antd';

/* 文件导出的错误提示处理示例 */
export async function exportData() {
  const data = await request('/download', {
    responseType: 'blob',
  });
  if (data.type === 'application/json') {
    const reader = new FileReader();
    reader.onload = function () {
      const data = JSON.parse(reader.result as string);
      // 自定义错误提示
      if (data.code !== '0') {
        message.error(data.message);
      }
    };
    reader.readAsText(data);
    return false;
  }
  return data;
}
