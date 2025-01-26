import { message } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './pages/Layout';
import { AntdMessageContext } from './hooks/antd';

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <AntdMessageContext.Provider value={messageApi}>
      {contextHolder}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AntdMessageContext.Provider>
  );
}

export default App;
