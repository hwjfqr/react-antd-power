import { ReactNode, useState, useEffect } from 'react';
import { Dropdown, Menu } from 'antd';
import ProLayout from '@ant-design/pro-layout';
import {
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import styles from './BaseLayout.less';
import { useSetDocTitle, useIsMobile } from '@/utils/hoots';
import Context from '@/context';

interface BaseLayoutProps {
  location: { pathname: string };
  children: ReactNode;
}
function BaseLayout({ location, children }: BaseLayoutProps) {
  const deviceType = useIsMobile();
  useSetDocTitle('CurdTemplate');

  // 菜单随路由选中逻辑
  const [curMenuItem, setCurMenuItem] = useState<string>('/');
  const { pathname } = location;
  useEffect(() => {
    if (pathname !== curMenuItem) {
      setCurMenuItem(pathname);
    }
  }, [pathname]);

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`${styles['base-layout'] || ''} ${
        deviceType === 'mobile' ? styles['mobile-style'] : ''
      }`}
    >
      <ProLayout
        style={{ minHeight: '100vh' }}
        title="CurdTemplate"
        logo={null}
        navTheme="light"
        layout="mix"
        fixSiderbar
        location={{
          pathname: curMenuItem,
        }}
        route={{
          path: '/',
          routes: [
            {
              name: '用户管理',
              path: '/app/curd',
              icon: <UserOutlined />,
            },
            // {
            //   name: '系统管理',
            //   path: '/sys',
            //   icon: <SettingOutlined />,
            //   routes: [{ name: '角色管理', path: '/sys/role' }],
            // },
          ],
        }}
        collapsed={collapsed}
        onCollapse={(val) => {
          setCollapsed(val);
        }}
        onMenuHeaderClick={() => {
          history.push('/');
        }}
        menuItemRender={(item, dom) => (
          <a
            onClick={() => {
              const { path } = item;
              if (!path) return;
              if (deviceType === 'mobile') {
                setCollapsed(true);
              }
              setCurMenuItem(path);
              if (/^\//.test(path)) {
                history.push(path);
              }
            }}
          >
            {dom}
          </a>
        )}
        rightContentRender={() => (
          <div style={{ color: '#fff' }}>
            <div>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      key="logout"
                      icon={<LogoutOutlined />}
                      onClick={() => {}}
                    >
                      退出登录
                    </Menu.Item>
                  </Menu>
                }
              >
                <span
                  onClick={(e) => e.preventDefault()}
                  style={{ cursor: 'pointer' }}
                >
                  <>{'用户名' || '-'}</>
                </span>
              </Dropdown>
            </div>
          </div>
        )}
      >
        <Context.Provider value={{ deviceType }}>{children}</Context.Provider>
      </ProLayout>
    </div>
  );
}
export default BaseLayout;
