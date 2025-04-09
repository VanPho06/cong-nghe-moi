import React from 'react';

const MessageComponent = ({ message, isSentByUser }) => {
    const formattedTime = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`flex flex-col m-4 ${isSentByUser ? 'items-end' : 'items-start'}`}>
            <div
                className={`px-4 py-2 max-w-[75%] rounded-lg text-sm break-words shadow-md ${isSentByUser
                        ? 'bg-blue-500 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 rounded-tl-none'
                    }`}
            >
                <p>{message.content}</p>
            </div>
            <span
                className={`text-xs text-gray-500 mt-1 ${isSentByUser ? 'text-right' : 'text-left'
                    }`}
            >
                {formattedTime}
            </span>
        </div>
    );
};

export default MessageComponent;
