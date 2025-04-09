import { useState } from 'react';
import { Lock, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('')
    const navigate = useNavigate();
    const handleLogin = async () => {
        if (!phoneNumber || !password) {
            setMessage('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, password })

            });
            const data = await response.json();

            if (response.ok) {
                onLoginSuccess(data.user.phoneNumber);
                navigate('/')
            } else {
                setMessage(data.error || 'Đăng nhập thất bài!');
            }
        } catch (error) {
            setMessage('Lỗi kết nối: ' + error.message);
        }

    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50">
            <div className="w-full max-w-md p-6">
                <div className="flex justify-center mb-4">
                    <img
                        src="/images/zalo-logo.png"
                    />
                </div>

                <div className="text-center mb-6">
                    <p className="text-sm text-gray-700">
                        <span className="font-bold">Đăng nhập tài khoản Zalo</span><br />
                        <span className="text-xs text-gray-500">để kết nối với ứng dụng Zalo Web</span>
                    </p>
                </div>

                <div className="bg-white rounded-md p-6 shadow-sm border border-blue-100">
                    <h2 className="text-center text-sm font-medium mb-6">Đăng nhập với mật khẩu</h2>

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

                    <div className="mb-6">
                        <div className="flex items-center border-b border-gray-300 pb-1">
                            <div className="pr-2">
                                <Lock className="w-5 h-5 text-gray-500" />
                            </div>
                            <input
                                type="password"
                                className="w-full py-1 focus:outline-none text-sm"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        className="w-full bg-blue-400 text-white py-2 rounded-md text-sm hover:bg-blue-500 transition duration-300"
                        onClick={handleLogin}
                    >
                        Đăng nhập với mật khẩu
                    </button>
                    {/* Hiển thị thông báo */}
                    {message && (
                        <p className={`text-center mt-4 text-sm ${message.includes('thành công') ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}
                    <div className="text-center mt-4">
                        <a href="/forgetpassword" className="text-xs text-gray-600 hover:text-blue-500 font-medium">Quên mật khẩu</a>
                    </div>

                    <div className="text-center mt-6">
                        <a href="#" className="text-xs text-blue-500 hover:underline flex items-center justify-center">
                            <QrCode className="w-4 h-4 mr-1" />
                            Đăng nhập qua mã QR
                        </a>
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

                <div className="text-center mt-6">
                    <p className="text-xs text-gray-600">
                        Chưa có tài khoản? <Link to="/register" className="text-blue-500 hover:underline">Đăng kí ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;