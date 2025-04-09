import  { useState } from 'react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResetPassWord = ({phoneNumber}) => {
    
    const navigate = useNavigate(); // Khởi tạo useNavigate
    const [newpassword, setnewPassword] = useState('');
    const [confirmpassword, setconfirmPassword] = useState('');
    const [message,setMessage] = useState('')
    const phone = phoneNumber.phoneNumber;

    const handleResetPassword = async() =>{
        if(!newpassword || !confirmpassword)
        {
        setMessage('Vui lòng nhập đầy đủ thông tin');
        return;
        }
        if (newpassword !== confirmpassword)
        {
            setMessage('Confirm Password không đúng')
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/resetpassword',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({phoneNumber:phone,newpassword})
            
            });
            const data = await response.json();
            
            if(response.ok)
            {
                setMessage('Cập nhật thành công');
                setTimeout(() => {
                    navigate('/login');
                  }, 2000);
            } else{
                setMessage(data.error || 'Cập nhật thất bài!'  );
            }
        } catch (error) {
            setMessage('Lỗi kết nối: ' + error.message);
        }
        
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50">
            <div className="w-full max-w-md p-6">
                

                

                <div className="bg-white rounded-md p-6 shadow-sm border border-blue-100">
                    <h2 className="text-center text-sm font-medium mb-6">Đặt lại mật khẩu</h2>

                    <div className="mb-4 relative">
                        <div className="flex items-center border-b border-gray-300 pb-1">
                            <select className="text-gray-600 text-sm bg-transparent border-none focus:outline-none pr-1 appearance-none">
                                <option value="+84"></option>
                            </select>
                            <input
                                type="password"
                                className="w-full py-1 focus:outline-none text-sm"
                                placeholder="Mật khẩu"
                                value={newpassword}
                                onChange={(e) => setnewPassword(e.target.value)}
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
                                value={confirmpassword}
                                onChange={(e) => setconfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        className="w-full bg-blue-400 text-white py-2 rounded-md text-sm hover:bg-blue-500 transition duration-300"
                    onClick={handleResetPassword}
                    >
                        Thay đổi mật khẩu
                    </button>
                    {/* Hiển thị thông báo */}
                    {message && (
                        <p className={`text-center mt-4 text-sm ${message.includes('thành công') ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}
                    
                    
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

export default ResetPassWord;