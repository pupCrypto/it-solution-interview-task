import { Outlet, Link } from 'react-router-dom';
import { Layout as AntdLayout, Menu } from 'antd';


export default function Layout() {
  return (
    <AntdLayout>
      <AntdLayout.Header style={{ height: '64px'}}>
        <Menu theme='dark' mode='horizontal' defaultSelectedKeys={['1']}>
          <Menu.Item key='1'>
            <Link to='/'>Домашняя страница</Link>
          </Menu.Item>
          <Menu.Item key='2'>
            <Link to='/directory'>Справочник</Link>
          </Menu.Item>
        </Menu>
      </AntdLayout.Header>
      <AntdLayout.Content style={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}>
        <Outlet />
      </AntdLayout.Content>
    </AntdLayout>
  );
}