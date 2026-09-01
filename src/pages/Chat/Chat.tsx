import { Button, Empty, Input, List, Modal, Spin } from "antd";

import { useCallback, useEffect, useState } from "react";

import {
  type ChatMessage,
  type ChatUser,
  type Conversation,
  createPrivateConversationApi,
  getConversationsApi,
  getMessagesApi,
  getUsersApi,
} from "../../services/chatApi";

import { getSocket } from "../../services/socket";

import { useAppSelector } from "../../hooks/redux";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const Chat = () => {
  const { user } = useAppSelector((state) => state.auth);

  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [loading, setLoading] = useState(true);

  const [loadingMessages, setLoadingMessages] = useState(false);

  const [typingUserId, setTypingUserId] = useState<string | null>(null);

  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);

  const [searching, setSearching] = useState(false);

  /**
   * Search users
   */
  const handleSearchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);

      return;
    }

    try {
      setSearching(true);

      const response = await getUsersApi(query);

      setSearchResults(response.data.users);
    } catch (error) {
      console.error("Search users error:", error);
    } finally {
      setSearching(false);
    }
  }, []);

  /**
   * Create conversation
   */
  const handleCreateConversation = async (targetUserId: string) => {
    try {
      const response = await createPrivateConversationApi(targetUserId);

      const newConversation = response.data.conversation;

      await loadConversations();

      setSelectedConversation(newConversation);

      setMessages([]);

      setTypingUserId(null);

      await loadMessages(newConversation._id);

      const socket = getSocket();

      socket?.emit("join_conversation", newConversation._id);

      setSearchModalOpen(false);

      setSearchQuery("");

      setSearchResults([]);
    } catch (error) {
      console.error("Create conversation error:", error);
    }
  };

  /**
   * Load conversations
   */
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getConversationsApi();

      setConversations(response.data.conversations);
    } catch (error) {
      console.error("Load conversations error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load messages
   */
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      setLoadingMessages(true);

      const response = await getMessagesApi(conversationId);

      setMessages(response.data.messages);
    } catch (error) {
      console.error("Load messages error:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  /**
   * Select conversation
   */
  const handleSelectConversation = async (conversation: Conversation) => {
    const socket = getSocket();

    /**
     * Leave old room
     */
    if (selectedConversation && selectedConversation._id !== conversation._id) {
      socket?.emit("leave_conversation", selectedConversation._id);
    }

    setSelectedConversation(conversation);

    setMessages([]);

    setTypingUserId(null);

    /**
     * Load old messages
     */
    await loadMessages(conversation._id);

    /**
     * Join new room
     */
    socket?.emit("join_conversation", conversation._id);
  };
  /**
   * Find other user
   */
  const getOtherUser = (conversation: Conversation) => {
    return conversation.participants.find(
      (participant) => participant._id !== user?.id,
    );
  };
  /**
   * Send message
   */
  const handleSendMessage = (content: string) => {
    if (!selectedConversation) {
      return;
    }

    const socket = getSocket();

    if (!socket || !socket.connected) {
      console.error("Socket is not connected");

      return;
    }

    socket.emit("send_message", {
      conversationId: selectedConversation._id,
      content,
      type: "text",
    });
  };
  /**
   * Read message
   */
  const handleMessageVisible = useCallback(
    (message: ChatMessage) => {
      if (!selectedConversation || !user?.id) {
        return;
      }

      const senderId =
        typeof message.senderId === "string"
          ? message.senderId
          : message.senderId._id;

      if (senderId === user.id || message.isRead) {
        return;
      }

      const socket = getSocket();

      socket?.emit("message_read", {
        conversationId: selectedConversation._id,

        messageId: message._id,
      });
    },
    [selectedConversation, user?.id],
  );
  /**
   * Initial conversations
   */
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);
  /**
   * Socket events
   */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      return;
    }
    /**
     * New message
     */
    const handleNewMessage = ({ message }: { message: ChatMessage }) => {
      /**
       * Nếu message thuộc conversation
       * đang mở
       */
      if (message.conversationId === selectedConversation?._id) {
        setMessages((currentMessages) => {
          const exists = currentMessages.some(
            (item) => item._id === message._id,
          );

          if (exists) {
            return currentMessages;
          }

          return [...currentMessages, message];
        });

        /**
         * Nếu tin nhắn của người khác
         * thì đánh dấu đã đọc
         */
        const senderId =
          typeof message.senderId === "string"
            ? message.senderId
            : message.senderId._id;

        if (senderId !== user?.id) {
          socket.emit("message_read", {
            conversationId: message.conversationId,

            messageId: message._id,
          });
        }
      }

      /**
       * Refresh conversation list
       */
      loadConversations();
    };

    /**
     * User typing
     */
    const handleUserTyping = ({
      userId,
      conversationId,
    }: {
      userId: string;
      conversationId: string;
    }) => {
      if (conversationId === selectedConversation?._id) {
        setTypingUserId(userId);
      }
    };

    /**
     * User stopped typing
     */
    const handleUserStoppedTyping = ({
      userId,
      conversationId,
    }: {
      userId: string;
      conversationId: string;
    }) => {
      if (
        conversationId === selectedConversation?._id &&
        userId === typingUserId
      ) {
        setTypingUserId(null);
      }
    };

    /**
     * Message read
     */
    const handleMessageRead = ({ messageId }: { messageId: string }) => {
      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message._id === messageId
            ? {
                ...message,
                isRead: true,
              }
            : message,
        ),
      );
    };

    socket.on("new_message", handleNewMessage);

    socket.on("user_typing", handleUserTyping);

    socket.on("user_stopped_typing", handleUserStoppedTyping);

    socket.on("message_read", handleMessageRead);

    return () => {
      socket.off("new_message", handleNewMessage);

      socket.off("user_typing", handleUserTyping);

      socket.off("user_stopped_typing", handleUserStoppedTyping);

      socket.off("message_read", handleMessageRead);
    };
  }, [selectedConversation?._id, user?.id, typingUserId, loadConversations]);

  /**
   * Loading
   */
  if (loading) {
    return (
      <div
        style={{
          height: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        height: "calc(100vh - 64px)",
        display: "flex",
        background: "#fff",
      }}
    >
      {/* ===================== */}
      {/* SIDEBAR */}
      {/* ===================== */}

      <div
        style={{
          width: 320,
          minWidth: 320,
          borderRight: "1px solid #eee",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 24,
            }}
          >
            Messages
          </h2>

          <Button type="primary" onClick={() => setSearchModalOpen(true)}>
            + New Chat
          </Button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          {conversations.length === 0 ? (
            <Empty
              description="Chưa có cuộc trò chuyện"
              style={{
                marginTop: 80,
              }}
            />
          ) : (
            conversations.map((conversation) => {
              const otherUser = getOtherUser(conversation);

              if (!otherUser) {
                return null;
              }

              const active = selectedConversation?._id === conversation._id;

              return (
                <div
                  key={conversation._id}
                  onClick={() => handleSelectConversation(conversation)}
                  style={{
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    background: active ? "#eaf4ff" : "#fff",
                    borderBottom: "1px solid #f5f5f5",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        background: "#e6f4ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        color: "#1677ff",
                      }}
                    >
                      {otherUser.username.charAt(0).toUpperCase()}
                    </div>

                    {otherUser.status === "online" && (
                      <span
                        style={{
                          position: "absolute",
                          right: 0,
                          bottom: 1,
                          width: 11,
                          height: 11,
                          borderRadius: "50%",
                          background: "#52c41a",
                          border: "2px solid white",
                        }}
                      />
                    )}
                  </div>

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      {otherUser.username}
                    </div>

                    <div
                      style={{
                        marginTop: 4,
                        color: "#999",
                        fontSize: 13,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {conversation.lastMessage?.content ||
                        "Bắt đầu trò chuyện"}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ===================== */}
      {/* CHAT */}
      {/* ===================== */}

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!selectedConversation ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Empty description="Chọn một cuộc trò chuyện" />
          </div>
        ) : (
          <>
            <ChatHeader
              user={getOtherUser(selectedConversation)}
              isTyping={typingUserId !== null}
            />

            {loadingMessages ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Spin />
              </div>
            ) : (
              <MessageList
                messages={messages}
                currentUserId={user?.id}
                onMessageVisible={handleMessageVisible}
              />
            )}

            {typingUserId && (
              <div
                style={{
                  padding: "0 24px 8px",
                  color: "#999",
                  fontSize: 12,
                }}
              >
                {getOtherUser(selectedConversation)?.username || "User"} đang
                nhập...
              </div>
            )}

            <MessageInput
              conversationId={selectedConversation._id}
              onSend={handleSendMessage}
            />
          </>
        )}
      </div>

      {/* Search Users Modal */}
      <Modal
        title="Tìm người dùng"
        open={searchModalOpen}
        onCancel={() => {
          setSearchModalOpen(false);
          setSearchQuery("");
          setSearchResults([]);
        }}
        footer={null}
      >
        <Input
          placeholder="Tìm theo username hoặc email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearchUsers(e.target.value);
          }}
          style={{ marginBottom: 16 }}
        />

        {searching ? (
          <div
            style={{
              textAlign: "center",
              padding: 20,
            }}
          >
            <Spin />
          </div>
        ) : searchResults.length > 0 ? (
          <List
            dataSource={searchResults}
            renderItem={(user) => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleCreateConversation(user._id)}
                  >
                    Chat
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={user.username}
                  description={user.email}
                />
              </List.Item>
            )}
          />
        ) : searchQuery ? (
          <Empty description="Không tìm thấy người dùng" />
        ) : (
          <Empty description="Nhập từ khóa để tìm kiếm" />
        )}
      </Modal>
    </div>
  );
};

export default Chat;
