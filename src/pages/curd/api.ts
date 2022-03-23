import request from '@/utils/request';
import { message } from 'antd';

export type ListFilterType = {
  page: number;
  pageSize?: number;
  name?: string;
  type?: string;
};
export async function getList({ page, pageSize, name, type }: ListFilterType) {
  const { data = [], meta = { pagination: { total: 0 } } } = await request(
    '/mock/list',
    {
      params: {
        page,
        pageSize,
        name,
        type: type === 'all' ? undefined : type,
      },
    },
  );
  const {
    pagination: { total },
  } = meta;
  return { data, total };
}

export type AddOrEditDataType = {
  id?: string;
  username: string;
  type: string;
  status: number;
};
export async function addOrEditListItem({
  id,
  username,
  type,
  status,
}: AddOrEditDataType) {
  let url = '/mock/add';
  let method = 'post';
  if (!!id) {
    url = '/mock/update';
    method = 'put';
  }

  const { isError } = await request(url, {
    method,
    data: {
      id,
      username,
      type,
      status,
    },
  });
  return !isError;
}

export async function deleteListItem(id: number) {
  const { isError } = await request('/delete', {
    method: 'delete',
    data: { id },
  });
  return !isError;
}

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
