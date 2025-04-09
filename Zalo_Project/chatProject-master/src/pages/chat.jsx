import React, { useState, useEffect, useRef } from 'react';
import { Search, Settings, MessageCircle, Cloud, Home, Image, Paperclip, Send, Smile, Users, UserPlus, Video, Contact } from 'lucide-react';
import ContactItem from '../components/ContactItem';
import MessageComponent from '../components/MessageItem';

const ChatPage = () => {
    const [message, setMessage] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const [userId, setUserId] = useState(1);
    const messagesEndRef = useRef(null);

    const testexample = Array(100).fill().map((_, i) => ({
        id: i,
        name: `Name ${i + 1}`,
        lastMessage: 'Bạn: ABCD',
        time: '15 phút',
        messages: [
            { id: 1, content: 'Xin chào! ' + i, created_at: new Date(), from: 2 },
            { id: 2, content: 'Chào bạn! ' + i, created_at: new Date(), from: 1 },
            { id: 3, content: 'Cái gì ', created_at: new Date(), from: 2 },
            { id: 4, content: i, created_at: new Date(), from: 1 },
        ]
    }));

    const handleSelectContact = (contact) => {
        setSelectedContact(contact);
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedContact?.messages]);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Left Sidebar - Navigation */}
            <div className="w-16 bg-blue-600 flex flex-col items-center py-4 text-white pt-[32px] pb-[12px] justify-between">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full mb-6" />
                    <button className="hover:bg-blue-700 m-1 rounded"><MessageCircle className='m-2' size={29} /></button>
                    <button className="hover:bg-blue-700 m-1 rounded"><Contact className='m-2' size={29} /></button>
                </div>
                <div className="flex flex-col items-center">
                    <div className='flex flex-col items-center border-b border-white'>
                        <button className="hover:bg-blue-700 m-1 rounded"><Cloud className='m-2' size={29} /></button>
                    </div>
                    <button className="hover:bg-blue-700 m-1 rounded"><Settings className='m-2' size={29} /></button>
                </div>

            </div>

            {/* Chat List */}
            <div className="w-[21rem] bg-white border-r h-screen">
                <div className="p-4 border-b flex justify-between">
                    <div className="flex items-center bg-gray-200 rounded-lg p-2">
                        <Search className="w-4 h-4 text-gray-500 items-center ml-2 mr-2" />
                        <input
                            className="bg-transparent ml-2 outline-none text-sm flex-1 items-center"
                            placeholder="Tìm kiếm"
                        />
                    </div>
                    <div className="flex items-center">
                        <button className="hover:bg-gray-200 rounded cursor-pointer"><UserPlus className="text-gray-500 cursor-pointer m-2" size={21} /></button>
                        <button className="hover:bg-gray-200 rounded cursor-pointer"><Users className="text-gray-500 cursor-pointer m-2" size={20} /></button>
                    </div>
                </div>
                {/* track : full, thumb : a part  */}
                <div className="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-lg" style={{ maxHeight: 'calc(100vh - 70px)' }}>
                    {/* Sử dụng ContactItem component trong map */}
                    {testexample.map((contact) => (
                        <ContactItem
                            key={contact.id}
                            contact={contact}
                            onClick={() => handleSelectContact(contact)}
                        />
                    ))}
                </div>

            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedContact ? (
                    <>
                    
                        {/* Chat Header */}
                        <div className="border-b bg-white flex items-center py-3 px-4 justify-between">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-300 rounded-full" />
                                <div className="ml-3">
                                    <div className="font-medium">{selectedContact.name}</div>
                                    <div className="text-sm text-gray-500">Truy cập 1 giờ trước</div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button className="hover:bg-gray-200 m-1 rounded cursor-pointer"><Users className="text-gray-500 m-2" size={20} /></button>
                                <button className="hover:bg-gray-200 m-1 rounded cursor-pointer"><Video className="text-gray-500 m-2" size={20} /></button>
                                <button className="hover:bg-gray-200 m-1 rounded cursor-pointer"><Search className="text-gray-500 m-2" size={20} /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            {selectedContact.messages.map((msg) => (
                                <div className="flex-1 p-4 overflow-y-auto">
                                    {selectedContact.messages.map((msg) => (
                                        <MessageComponent
                                            key={msg.id}
                                            message={msg}
                                            isSentByUser={msg.from === userId}
                                        />
                                    ))}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border-t bg-white">
                            <div className="flex items-center flex-col">
                                <div className="flex space-x-2 w-full px-2 py-1 align-center">
                                    <button className="p-2 hover:bg-gray-200 rounded cursor-pointer">
                                        <Paperclip className="text-gray-500" size={22} />
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 rounded cursor-pointer">
                                        <Image className="text-gray-500" size={22} />
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 rounded cursor-pointer">
                                        <Smile className="text-gray-500" size={22} />
                                    </button>
                                </div>
                                <div className="flex items-center w-full">
                                    <input
                                        type="text"
                                        className="flex-1 p-4 w-full border focus:outline-none"
                                        placeholder={`Nhập @, tin nhắn tới ${selectedContact.name}`}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
                        <p className="text-2xl">Chọn một cuộc trò chuyện</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;