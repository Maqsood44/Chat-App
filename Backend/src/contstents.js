export const DB_NAME = "Chat_App"
// cookie secure options
export const options = {
  httpOnly: true,
  secure: true,
}

export const ChatEventEnum = {
  JOIN_CHAT_EVENT: "join_chat",
  TYPING_EVENT: "typing",
  STOP_TYPING_EVENT: "stop_typing",
  SEND_MESSAGE_EVENT: "send_message", 
  RECEIVE_MESSAGE_EVENT: "receive_message", 
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  SOCKET_ERROR_EVENT: "socket_error",
};

export const AvailableChatEvents = Object.values(ChatEventEnum);