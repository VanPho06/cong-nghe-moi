import { User, Lock } from 'lucide-react';
import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [message, setMessage] = useState(''); // Để hiển thị thông báo
    const navigate = useNavigate();
    const handleRegister = async () => {
        // Kiểm tra dữ liệu trước khi gửi
        if (!phoneNumber || !fullName || !password || !confirmPassword) {
          setMessage('Vui lòng nhập đầy đủ thông tin');
          return;
        }
        if (password !== confirmPassword) {
          setMessage('Mật khẩu không khớp');
          return;
        }
        if (!agreeTerms) {
          setMessage('Vui lòng đồng ý với điều khoản sử dụng');
          return;
        }
    
        // Gửi yêu cầu tới backend
        try {
          const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber, fullName, password }),
          });
    
          const data = await response.json();
          console.log(data.phoneNumber)
          if (response.ok) {
            navigate('/verifyotpresgiter',{state :{phoneNumber: data.phoneNumber}});
          } else {
            setMessage(data.error || 'Đã có lỗi xảy ra');
          }
        } catch (err) {
          setMessage('Lỗi kết nối: ' + err.message);
        }
      };
    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50">
            <div className="w-full max-w-md p-6">
                <div className="flex justify-center mb-4">
                    <img
                        src='/images/zalo-logo.png'
                    />
                </div>

                <div className="text-center mb-6">
                    <p className="text-sm text-gray-700">
                        <span className="font-bold">Đăng ký tài khoản Zalo</span><br />
                        <span className="text-xs text-gray-500">để kết nối với bạn bè và ứng dụng Zalo Web</span>
                    </p>
                </div>

                <div className="bg-white rounded-md p-6 shadow-sm border border-blue-100">
                    <h2 className="text-center text-sm font-medium mb-6">Tạo tài khoản mới</h2>

                    <div className="mb-4 relative">
                        <div className="flex items-center border-b border-gray-300 pb-1">
                            <select className="text-gray-600 text-sm bg-transparent border-none focus:outline-none pr-1 appearance-none">
                                <option value="+84">+84</option>
                            </select>
                            <input
                                type="tel"
                                className="w-full py-1 focus:outline-none text-sm"
                                placeholder="Số điện thoại"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center border-b border-gray-300 pb-1">
                            <div className="pr-2">
                                <User className="w-5 h-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                className="w-full py-1 focus:outline-none text-sm"
                                placeholder="Họ và tên"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center border-b border-gray-300 pb-1">
                            <div className="pr-2">
                                <Lock className="w-5 h-5 text-gray-500" />
                            </div>
                            <input
                                type="password"
                                className="w-full py-1 focus:outline-none text-sm"
                                placeholder="Mật khẩu (ít nhất 6 ký tự)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center border-b border-gray-300 pb-1">
                            <div className="pr-2">
                                <Lock className="w-5 h-5 text-gray-500" />
                            </div>
                            <input
                                type="password"
                                className="w-full py-1 focus:outline-none text-sm"
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-4 flex items-start">
                        <input
                            type="checkbox"
                            id="terms"
                            className="mt-1 mr-2"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                        />
                        <label htmlFor="terms" className="text-xs text-gray-600">
                            Tôi đồng ý với <a href="#" className="text-blue-500">Điều khoản sử dụng</a> và <a href="#" className="text-blue-500">Chính sách bảo mật</a> của Zalo
                        </label>
                    </div>

                    <button
                        className="w-full bg-blue-400 text-white py-2 rounded-md text-sm hover:bg-blue-500 transition duration-300"
                        onClick={handleRegister}
                    >
                        Đăng ký
                    </button>
                    {/* Hiển thị thông báo */}
                    {message && (
                        <p className={`text-center mt-4 text-sm ${message.includes('thành công') ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}

                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-600">
                            Đã có tài khoản? <Link to="/login" className="text-blue-500 hover:underline">Đăng nhập ngay</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-4 bg-white p-4 border border-blue-100 rounded-md flex items-center shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex-shrink-0 mr-3">
                        <img src="/images/computer.png" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-700">
                            <span className="font-medium">Nâng cao hiệu quả công việc với Zalo PC</span><br />
                            Gọi điện tốt hơn đến 1 GB, chụp màn hình, gửi video và nhiều tính năng hơn nữa
                        </p>
                    </div>
                    <div className="ml-2">
                        <button className="bg-blue-500 text-white px-3 py-3 rounded-md text-xs">Tải ngay</button>
                    </div>
                </div>

                <div className="mt-6 text-center text-xs text-gray-500">
                    <a href="#" className="text-blue-500 mx-2">Tiếng Việt</a>
                    <span>•</span>
                    <a href="#" className="text-blue-500 mx-2">English</a>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;