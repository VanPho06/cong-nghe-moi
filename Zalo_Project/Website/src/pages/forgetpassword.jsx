import { useState } from 'react';
import ForgetPassWord_EnterPhoneNumber from '../components/FP_EnterPhoneNumber';
import VerifyOTP from '../components/VerifyOTP';
import ResetPassWord from '../components/ResetPassword';


const ForgetPassWord = () => {
    const [step,setstep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleRequesOTP = (phone) =>{
        setPhoneNumber(phone);
        setstep(2);
    }
    const handleVerifySuccess = () => {
        setstep(3); // Chuyển sang bước ResetPassword sau khi OTP đúng
      };
    const handleBack = () => {
        setstep(1); // Quay lại bước ForgotPassword
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
                        <span className="font-bold">Khôi phục mật khẩu Zalo</span><br />
                        <span className="text-xs text-gray-500">để kết nối với ứng dụng Zalo Web</span>
                    </p>
                </div>
                {
                   step === 1 ? (
                        <ForgetPassWord_EnterPhoneNumber onRequestOTP={handleRequesOTP}/>
                    ) : step === 2 ? (
                        <VerifyOTP phoneNumber={ phoneNumber} onBack={handleBack} ResetPassWord= {handleVerifySuccess}/>
                    ) : (
                        <ResetPassWord phoneNumber={ phoneNumber}  />
                    )
                }
                
    
                
    
                <div className="mt-6 text-center text-xs text-gray-500">
                    <a href="#" className="text-blue-500 mx-2">Tiếng Việt</a>
                    <span>•</span>
                    <a href="#" className="text-blue-500 mx-2">English</a>
                </div>
    
                
            </div>
        </div>
        
    );
};

export default ForgetPassWord;