import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import ChatPage from './pages/chat';
import ForgetPassWord from './pages/forgetpassword';
import ResetPassWord from './components/ResetPassword';
import VerifyOTPResgiter from './components/VerifyOTPResgiter';
import { useState } from 'react'
function App() {
  const [userId, setUserId] = useState(null);

  const handleLoginSuccess = (userId) => {
    setUserId(userId);
  };

  const handleLogout = () => {
    setUserId(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/resetpassword" element={< ResetPassWord />} />
        <Route path="/forgetpassword" element={<ForgetPassWord />} />
        <Route
          path="/login"
          element={
            userId ?
              <Navigate to="/" replace /> :
              <LoginPage onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            userId ?
              <ChatPage userId={userId} onLogout={handleLogout} /> :
              <Navigate to="/login" replace />
          }
        />
        <Route path="/verifyotpresgiter" element={<VerifyOTPResgiter />} />
      </Routes>
    </Router>
  );
}

export default App;