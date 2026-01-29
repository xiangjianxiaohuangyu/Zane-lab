/**
 * App 主应用组件
 *
 * 包含路由配置和整体布局结构
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Container } from './components/layout/Container';
import { PageTransition } from './components/ui/PageTransition';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Writing } from './pages/Writing';
import { WritingCategory } from './pages/WritingCategory';
import { WritingDetail } from './pages/WritingDetail';
import { Records } from './pages/Records';
import { RecordCategory } from './pages/content/RecordCategory';

/**
 * ScrollToTop 组件
 *
 * 在路由变化时自动滚动到页面顶部
 */
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

/**
 * App 内部组件（使用 useLocation）
 */
function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      {/* 右上角导航栏 */}
      <Header />

      {/* 主要内容区域 */}
      <main>
        <Container>
          <PageTransition key={location.pathname}>
            <Routes>
              {/* 首页路由 */}
              <Route path="/" element={<Home />} />

              {/* 项目路由 */}
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />

              {/* 写作路由 */}
              <Route path="/writing" element={<Writing />} />
              <Route path="/writing/:category" element={<WritingCategory />} />
              <Route path="/writing/:category/:slug" element={<WritingDetail />} />

              {/* 记录路由 */}
              <Route path="/records" element={<Records />} />
              <Route path="/records/:category" element={<RecordCategory />} />

              {/* TODO: 后续添加详情页路由 */}
              {/* <Route path="/writing/:category/:slug" element={<WritingDetail />} /> */}
              {/* <Route path="/records/:category/:slug" element={<RecordDetail />} /> */}
            </Routes>
          </PageTransition>
        </Container>
      </main>
    </div>
  );
}

/**
 * App 组件
 *
 * 应用的根组件，配置所有路由
 */
function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
