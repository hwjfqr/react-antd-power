import { ColumnsType } from 'antd/es/table';
import moment from 'moment';

export const listCols: ColumnsType<{ [prop: string]: any }> &
  {
    [prop: string]: any;
  }[] = [
  {
    title: '用户名',
    dataIndex: 'username',
    width: 100,
    render: (text) => text || '-',
  },
  {
    title: '用户类型',
    dataIndex: 'type',
    width: 100,
    render: (text) => text || '-',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 130,
    render: (text) => (text ? '启用' : '禁用'),
  },
];

export const getListItemDetails = (data: { [prop: string]: any }) => {
  let map: { [prop: string]: any } = {};
  [...listCols].forEach(({ dataIndex, title, render }) => {
    map[dataIndex] = {
      label: title,
      format: render,
    };
  });
  map = {
    ...map,
    insert_time: {
      label: '添加时间',
      format: (text?: number) =>
        text ? moment.unix(text).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
  };

  const result = Object.keys(map).map((k) => {
    const { label, format } = map[k];
    const value = data[k];
    return {
      label,
      value: format ? format(value, data) : value,
    };
  });

  return result;
};
