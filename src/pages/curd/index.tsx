import { useState, useEffect, useContext } from 'react';
import {
  Table,
  Card,
  Form,
  Input,
  Checkbox,
  Radio,
  Button,
  Space,
  message,
  Modal,
  Select,
  Row,
  Col,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { TagSelector, ModalDetail, ModalForm } from 'ant-design-power';
// import StandardFormRow from '@/components/StandardFormRow';
import Context from '@/context';
import { getListItemDetails, listCols as cols } from './data';
import {
  getList,
  addOrEditListItem,
  deleteListItem,
  ListFilterType,
  AddOrEditDataType,
} from './api';
import styles from './index.less';

function CurdTemplate() {
  const { deviceType } = useContext(Context);

  /* 列表逻辑 */
  const [form] = Form.useForm();
  const [list, setList] = useState({
    data: [],
    total: 0,
  });
  const [listFilter, setListFilter] = useState<ListFilterType>({
    page: 1,
    pageSize: 10,
    name: undefined,
  });
  const getListFn = async () => {
    const { data, total } = await getList(listFilter);
    setList({ data, total });
  };
  useEffect(() => {
    getListFn();
  }, [listFilter]);
  const handleFilterSubmit = async (
    values: Omit<ListFilterType, 'page' | 'pageSize'>,
  ) => {
    setListFilter({
      ...listFilter,
      ...values,
      page: 1,
    });
  };

  /* 详情逻辑 */
  const [listItemDetailArgs, setListItemDetailArgs] = useState<{
    visible: boolean;
    data: { label: string; value?: string }[];
  }>({
    visible: false,
    data: [],
  });

  /* 添加与删除逻辑 */
  const [listItemFormArgs, setListItemFormArgs] = useState<{
    visible: boolean;
    data?: AddOrEditDataType;
  }>({
    visible: false,
  });
  const listCols = [
    ...cols,
    {
      title: '操作',
      dataIndex: 'operate',
      width: 120,
      render: (_: any, r: any) => {
        return (
          <Space>
            <a
              onClick={() => {
                const data = getListItemDetails(r);
                setListItemDetailArgs({
                  visible: true,
                  data,
                });
              }}
            >
              详情
            </a>
            <a
              onClick={() => {
                setListItemFormArgs({
                  visible: true,
                  data: { ...r },
                });
              }}
            >
              修改
            </a>
            <a
              className="danger-text"
              onClick={() => {
                Modal.confirm({
                  title: '删除',
                  content: `确认删除吗？`,
                  onOk: async () => {
                    const b = await deleteListItem(r.id as number);
                    if (b) {
                      message.success('删除成功！');
                      if (list.data.length === 1 && listFilter.page > 1) {
                        setListFilter({
                          ...listFilter,
                          page: listFilter.page - 1,
                        });
                      } else {
                        getListFn();
                      }
                    }
                  },
                });
              }}
            >
              删除
            </a>
          </Space>
        );
      },
    },
  ];

  return (
    <div className={styles['curd-template']}>
      <PageContainer
        title="用户管理"
        extra={
          <Button
            type="primary"
            onClick={() => {
              setListItemFormArgs({
                visible: true,
              });
            }}
          >
            新增
          </Button>
        }
      >
        <Card
          style={{ marginBottom: deviceType === 'web' ? 16 : 0 }}
          size={deviceType === 'web' ? 'default' : 'small'}
        >
          <Form
            layout="inline"
            form={form}
            onFinish={handleFilterSubmit}
            onFinishFailed={(err) => console.log(`Failed:${err}`)}
          >
            <Form.Item label="用户名" name="name">
              <Input style={{ width: 150 }} size="small"></Input>
            </Form.Item>
            <Form.Item label="用户类型" name="type">
              <TagSelector
                type="radio"
                tags={['管理员', '普通用户', '访客'].map((item) => ({
                  label: item,
                  value: item,
                }))}
              ></TagSelector>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 6 }}
                size="small"
              >
                查询
              </Button>
              <Button
                size="small"
                onClick={() => {
                  form.resetFields();
                  setListFilter({
                    ...listFilter,
                    name: undefined,
                  });
                }}
              >
                重置
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Card size={deviceType === 'web' ? 'default' : 'small'}>
          <Table
            rowKey="id"
            size="small"
            columns={listCols}
            dataSource={list.data}
            pagination={{
              total: list.total,
              showTotal:
                deviceType === 'web'
                  ? (total) => `当前共有 ${total || '-'} 条数据`
                  : undefined,
              position: ['bottomCenter'],
              current: listFilter.page,
              pageSize: listFilter.pageSize,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                setListFilter({
                  ...listFilter,
                  page,
                  pageSize,
                });
              },
            }}
          ></Table>
        </Card>

        {/* 详情页面Modal */}
        <ModalDetail
          title="详情"
          descriptionsProps={{ size: 'small' }}
          visible={listItemDetailArgs.visible}
          data={listItemDetailArgs.data}
          onClose={() => setListItemDetailArgs({ visible: false, data: [] })}
          modalProps={{ footer: null }}
        >
          {/* 额外要添加的内容 */}
        </ModalDetail>

        {/* 添加与修改表单Modal */}
        <ModalForm<AddOrEditDataType>
          title={!listItemFormArgs.data ? '添加' : '修改'}
          initialValue={listItemFormArgs.data}
          visible={listItemFormArgs.visible}
          onClose={() => {
            setListItemFormArgs({
              visible: false,
            });
          }}
          onSubmit={async (value, id) => {
            const b = await addOrEditListItem(value);
            if (b) {
              message.success(!id ? '添加成功！' : '修改成功！');
              setListFilter({
                ...listFilter,
                page: 1,
              });
            }
            return b;
          }}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请填写' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="用户类型" name="type">
            <Radio.Group>
              {[
                { label: '管理员', value: 'admin' },
                { label: '普通用户', value: 'user' },
                { label: '访客', value: 'guest' },
              ].map(({ label, value }) => (
                <Radio value={value} key={value}>
                  {label || '-'}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              {[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ].map(({ label, value }) => (
                <Radio value={value} key={value}>
                  {label || '-'}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </ModalForm>
      </PageContainer>
    </div>
  );
}

export default CurdTemplate;
