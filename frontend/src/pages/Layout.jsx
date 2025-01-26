import { Outlet, Link } from 'react-router-dom';
import { Layout as AntdLayout } from 'antd';


export default function Layout() {
  return (
    <AntdLayout>
      <AntdLayout.Content style={{ height: '100vh', overflow: 'auto' }}>
        <Outlet />
      </AntdLayout.Content>
    </AntdLayout>
  );
}