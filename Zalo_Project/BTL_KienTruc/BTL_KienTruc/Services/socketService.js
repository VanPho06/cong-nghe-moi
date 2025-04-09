import { io } from 'socket.io-client';

const SOCKET_URL = 'wss://ublgokfd9l.execute-api.ap-southeast-1.amazonaws.com/production/'; // Đảm bảo URL này là chính xác
let socket;

export const socketService = {
  connect: (userId) => {
    socket = io(SOCKET_URL, {
      query: { userId }, // Gửi userId nếu cần thiết
      transports: ['websocket'], // Chỉ sử dụng WebSocket
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    socket.on('message', (message) => {
      console.log('New message received:', message);
      // Xử lý tin nhắn mới ở đây
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  },

  sendMessage: (message) => {
    if (socket) {
      socket.emit('message', message);
    } else {
      console.error('Socket is not connected');
    }
  },

  subscribeToMessages: (callback) => {
    socket.on('message', callback);
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      console.log('Socket disconnected');
    }
  },
};