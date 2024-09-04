const io = require('socket.io-client');

// Giả sử token bạn đang muốn test là:
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZThkNjY5YWRkMmQ0ODM1ZjQ4OGE3MSIsImVtYWlsIjoicGhhbnF1b2NodW5nMjgwNzAyQGdtYWlsLmNvbSIsInBob25lIjoiMDc5NzcyMDU3NCIsInJlZklkIjoiNjkwMzgzOSIsImlzTG9ja2VkIjpmYWxzZSwiaWF0IjoxNzQ0NzcwMDc0LCJleHAiOjE3NDQ5NDI4NzR9.y0SSTCopK5xxVdAYE63FiPwPvTVhcCCBLF7ZQ8k92aA';

const socket = io('http://localhost:3001', {
  query: { token },
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('Socket connected!');
});

socket.on('authenticated', (data) => {
  console.log('Authenticated event:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});

