import request from '@/utils/request';

export type ListFilterType = {
  page: number;
  pageSize?: number;
  name?: string;
};
export async function getList({
  page,
  pageSize,
  name,
}: {
  page: number;
  pageSize?: number;
  name?: string;
}) {
  const { data = [], meta = { pagination: { total: 0 } } } = await request(
    '/mock/list',
    {
      params: {
        page,
        pageSize,
        name,
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
