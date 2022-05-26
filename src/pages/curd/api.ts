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

export type CreateOrUpdateDataTYpe = {
  id?: string;
  username: string;
  type: string;
  status: number;
};
export async function CreateOrUpdateLIstItem({
  id,
  username,
  type,
  status,
}: CreateOrUpdateDataTYpe) {
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
