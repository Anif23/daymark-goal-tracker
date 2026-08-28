import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import AuthLayout from './layout/AuthLayout'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import VerifyEmail from './pages/VerifyEmail'
import CompletedGoals from './pages/CompletedGoals'
import FavoriteGoals from './pages/FavoriteGoals'
import Home from './pages/Home'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/goals/completed" element={<CompletedGoals />} />
          <Route path="/goals/favorites" element={<FavoriteGoals />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
