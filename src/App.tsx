import { Navigate, Route, Routes } from 'react-router-dom'
import BottomNav from './components/bottomNav/BottomNav'
import ProtectedRoute from './components/protectedRoute/ProtectedRoute'
import SiteAtmosphere from './components/siteAtmosphere/SiteAtmosphere'
import AccountPage from './pages/AccountPage'
import AdminArticleEditPage from './pages/AdminArticleEditPage'
import AdminArticlesPage from './pages/AdminArticlesPage'
import AdminPage from './pages/AdminPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import ArticlesPage from './pages/ArticlesPage'
import LoginPage from './pages/LoginPage'
import PortfolioPage from './pages/PortfolioPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'
import './components/contactSection/style.css'

function App() {
  return (
    <>
      <SiteAtmosphere />
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/projetos/:id" element={<ProjectDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/artigos" element={<ArticlesPage />} />
        <Route path="/artigos/:id" element={<ArticleDetailPage />} />
        <Route
          path="/conta"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/artigos"
          element={
            <ProtectedRoute role="admin">
              <AdminArticlesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/artigos/novo"
          element={
            <ProtectedRoute role="admin">
              <AdminArticleEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/artigos/:id"
          element={
            <ProtectedRoute role="admin">
              <AdminArticleEditPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default App
