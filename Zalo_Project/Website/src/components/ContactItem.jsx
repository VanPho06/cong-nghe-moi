import React from 'react';

const ContactItem = ({ contact, onClick }) => {
    return (
        <div
            className="p-3 flex items-center hover:bg-gray-100 cursor-pointer"
            onClick={onClick} // Thêm sự kiện onClick
        >
            <div className="w-14 h-14 bg-gray-300 rounded-full" />
            <div className="ml-3">
                <div className="font-medium">{contact.name}</div>
                <div className="text-sm text-gray-500">{contact.lastMessage}</div>
            </div>
            <div className="ml-auto text-xs text-gray-400">{contact.time}</div>
        </div>
    );
};

export default ContactItem;
