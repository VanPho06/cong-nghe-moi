import  { useState } from 'react';
import { Lock } from 'lucide-react';

const VerifyOTP = ({ phoneNumber, onBack , ResetPassWord}) => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const phone = phoneNumber.phoneNumber;
  const handleVerifyOTP = async () => {
    if (!otp) {
      setMessage('Vui lòng nhập mã OTP');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber:phone,otp}),
        // body: JSON.stringify({ phoneNumber,otp}),

      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        // Có thể thêm logic chuyển sang bước đặt lại mật khẩu
        
        ResetPassWord()

      } else {
        setMessage(data.error || 'Đã có lỗi xảy ra');
      }
    } catch (err) {
      setMessage('Lỗi kết nối: ' + err.message);
    }
  };

  return (
    <div>
      <h2 className="text-center text-sm font-medium mb-6">Xác nhận OTP</h2>
      <div className="mb-4">
        <div className="flex items-center border-b border-gray-300 pb-1">
          <div className="pr-2">
            <Lock className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="w-full py-1 focus:outline-none text-sm"
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
      </div>
      <button
        className="w-full bg-blue-400 text-white py-2 rounded-md text-sm hover:bg-blue-500 transition duration-300"
        onClick={handleVerifyOTP}
      >
        Xác nhận OTP
      </button>
      <button
        className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded-md text-sm hover:bg-gray-400 transition duration-300"
        onClick={onBack} // Quay lại bước nhập số điện thoại
      >
        Quay lại
      </button>
      {message && (
        <p className={`text-center mt-4 text-sm ${message.includes('thành công') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default VerifyOTP;