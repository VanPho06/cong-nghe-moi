import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import ChatPage from './pages/chat';
import ForgetPassWord from './pages/forgetpassword';
import ResetPassWord from './components/ResetPassword';
import VerifyOTPResgiter from './components/VerifyOTPResgiter';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/resetpassword" element={< ResetPassWord/>} />
        <Route path="/forgetpassword" element={<ForgetPassWord />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ChatPage />} />
        <Route path="/verifyotpresgiter" element={<VerifyOTPResgiter/>} />
      </Routes>
    </Router>
  );
}

export default App;