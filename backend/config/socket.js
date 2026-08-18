import { Server } from "socket.io";

export const userSocketMap = {};

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized."
    );
  }

  return io;
};

export const emitToUser = (
  userId,
  event,
  data
) => {
  const id = userId?.toString();

  const socketId =
    userSocketMap[id];

  if (socketId) {
    io.to(socketId).emit(
      event,
      data
    );
  }
};