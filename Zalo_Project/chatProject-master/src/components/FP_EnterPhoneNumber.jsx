import { useState } from "react";

const ForgetPassWord_EnterPhoneNumber =({ onRequestOTP }) => {
    const [phoneNumber,setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const handleRequesOTP = async() => {
        if(!phoneNumber)
        {
            setMessage("Vui lòng nhập số điện thoại");
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/forgot-password',
                {
                    method: 'POST',
                    headers: {'Content-Type' : 'application/json'},
                    body : JSON.stringify({phoneNumber}),
                } 

            );
            const data = await response.json;
            console.log(data.error)
            if(response.ok)
            {
                setMessage(`OTP đã được gửi. Vui lòng kiểm tra điện thoại ${data.otp}`);
                onRequestOTP({phoneNumber});
            } else {
                setMessage(data.error || "Đã có lỗi xảy ra");
            }
        } catch (error) {
            setMessage('Lỗi kết nối' + error.message);
            
        }
    }

    return (


        <div className="bg-white rounded-md p-6 shadow-sm border border-blue-100">
                <h2 className="text-center text-sm font-medium mb-6">Nhập số điện thoại của bạn</h2>

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

                

                <button
                    className="w-full bg-blue-400 text-white py-2 rounded-md text-sm hover:bg-blue-500 transition duration-300"
                    onClick={handleRequesOTP}
                >
                    Tiếp tục
                </button>
                {/* Hiển thị thông báo */}
                {message && (
                    <p className={`text-center mt-4 text-sm ${message.includes('thành công') ? 'text-green-500' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
                <div className="text-center mt-4">
                    <a href="/login" className="text-xs text-gray-600 hover:text-blue-500 font-medium"> Quay lại</a>
                </div>

                
            </div>
    );
}
export default ForgetPassWord_EnterPhoneNumber;