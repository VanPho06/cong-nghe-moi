import React, { useState } from 'react';
import { X, Edit2, Lock, ArrowLeft, Upload } from 'lucide-react';

const UserProfile = ({ user, onClose, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user.fullName || '',
        img: user.img || ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user.img || '');

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handlePasswordChange = (e) => setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            let imageUrl = formData.img;

            // Nếu có file ảnh mới thì upload
            if (selectedFile) {
                // Kiểm tra kích thước file (tối đa 5MB)
                if (selectedFile.size > 5 * 1024 * 1024) {
                    setMessage('Ảnh không được lớn hơn 5MB');
                    return;
                }

                // Kiểm tra định dạng file
                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (!allowedTypes.includes(selectedFile.type)) {
                    setMessage('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)');
                    return;
                }

                const formData = new FormData();
                formData.append('image', selectedFile);

                console.log('Đang upload ảnh...');
                const uploadResponse = await fetch('http://localhost:3000/upload', {
                    method: 'POST',
                    body: formData
                });
                console.log('Kết quả upload:', uploadResponse);

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    console.error('Lỗi upload:', errorData);
                    setMessage(errorData.error || 'Upload ảnh thất bại');
                    return;
                }

                const uploadData = await uploadResponse.json();
                console.log('URL ảnh mới:', uploadData.imageUrl);
                imageUrl = uploadData.imageUrl;
            }

            // Cập nhật thông tin user
            console.log('Đang cập nhật thông tin user...');
            const response = await fetch(`http://localhost:3000/user/${user.phoneNumber}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    img: imageUrl
                })
            });
            console.log('Kết quả cập nhật:', response);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Lỗi cập nhật:', errorData);
                setMessage(errorData.error || 'Cập nhật thất bại');
                return;
            }

            const data = await response.json();
            console.log('Cập nhật thành công:', data);

            setMessage('Cập nhật thông tin thành công');
            setIsEditing(false);
            setSelectedFile(null);
            setPreviewUrl(imageUrl);
            onUpdate({
                fullName: formData.fullName,
                img: imageUrl
            });
        } catch (error) {
            console.error('Lỗi:', error);
            setMessage('Lỗi kết nối: ' + error.message);
        }
    };

    const handleUpdatePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage('Mật khẩu mới không khớp');
            return;
        }

        const response = await fetch(`http://localhost:3000/users/${user.phoneNumber}/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            })
        });
        const data = await response.json();

        if (response.ok) {
            setMessage('Cập nhật mật khẩu thành công');
            setShowPasswordForm(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            setMessage(data.error || 'Cập nhật mật khẩu thất bại');
        }
    };

    const handleBackToProfile = () => {
        setShowPasswordForm(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {showPasswordForm ? 'Đổi mật khẩu' : 'Thông tin cá nhân'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {message && (
                    <div className={`mb-4 p-2 rounded ${message.includes('thành công') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                {!showPasswordForm ? (
                    <div className="space-y-4">
                        <div className="flex justify-center mb-4">
                            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex flex-col items-center gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="avatar-upload"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                                >
                                    <Upload size={16} className="mr-2" />
                                    Chọn ảnh
                                </label>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input
                                type="text"
                                value={user.phoneNumber || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'border-gray-300' : 'border-gray-300 bg-gray-50'}`}
                            />
                        </div>

                        <div className="flex justify-between pt-4">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                <Edit2 size={16} className="mr-2" />
                                {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                            </button>

                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            >
                                <Lock size={16} className="mr-2" />
                                Đổi mật khẩu
                            </button>
                        </div>

                        {isEditing && (
                            <button
                                onClick={handleUpdateProfile}
                                className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                                Lưu thay đổi
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <button
                            onClick={handleBackToProfile}
                            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Quay lại thông tin cá nhân
                        </button>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <button
                            onClick={handleUpdatePassword}
                            className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Cập nhật mật khẩu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile; 