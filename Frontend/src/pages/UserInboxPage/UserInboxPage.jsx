import React from "react";
import Header from "../../components/Layout/Header";
import { useState } from "react";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { useEffect } from "react";
import axios from "axios";
import { backend_Url, server } from "../../server";
import { useNavigate } from "react-router-dom";
import {
  ChatComposer,
  ChatThreadHeader,
  ConversationRow,
  EmptyInboxIllustration,
  MessageThread,
  chatShell,
  getAvatarUrl,
} from "../../components/Chat/ChatShared";
import {
  ConversationListSkeleton,
  MessageThreadSkeleton,
} from "../../components/Chat/ChatSkeletons";

const ENDPOINT = "http://localhost:4000/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });
const UserInboxPage = () => {
  const [ArrivalMessage, setArrivalMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [OnlineUsers, getOnlineUsers] = useState([]);
  const [newMessage, setnewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });

    return () => socketId.off("getMessage");
  }, []);

  useEffect(() => {
    const registerUser = () => {
      if (user?._id) {
        socketId.emit("addUser", user._id);
      }
    };

    socketId.on("connect", registerUser);
    registerUser();

    socketId.on("getUsers", (data) => {
      getOnlineUsers(data);
    });

    return () => {
      socketId.off("connect", registerUser);
      socketId.off("getUsers");
    };
  }, [user]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
    const online = OnlineUsers?.find((u) => u.userId === chatMembers);
    return online ? true : false;
  };

  useEffect(() => {
    if (
      ArrivalMessage &&
      currentChat?.members.includes(ArrivalMessage.sender)
    ) {
      setMessages((prev) => [...prev, ArrivalMessage]);
    }
  }, [ArrivalMessage, currentChat]);

  useEffect(() => {
    if (user?._id) {
      setConversationsLoading(true);
      axios
        .get(`${server}/conversation/get-all-conversation-user/${user._id}`, {
          withCredentials: true,
        })
        .then((res) => setConversations(res.data.conversations))
        .catch(console.log)
        .finally(() => setConversationsLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (currentChat?._id) {
      setMessagesLoading(true);
      setMessages([]);
      axios
        .get(`${server}/message/get-all-messages/${currentChat._id}`)
        .then((res) => setMessages(res.data.messages))
        .catch(console.log)
        .finally(() => setMessagesLoading(false));
    } else {
      setMessages([]);
      setMessagesLoading(false);
    }
  }, [currentChat]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() && !selectedImage) return;

    const recieverId = currentChat.members.find(
      (member) => member !== user._id,
    );

    const formData = new FormData();
    formData.append("sender", user._id);
    formData.append("text", newMessage);
    formData.append("conversationId", currentChat._id);
    if (selectedImage) {
      formData.append("images", selectedImage);
    }

    socketId.emit("sendMessage", {
      senderId: user._id,
      reciverId: recieverId,
      text: newMessage || "Sent an image",
    });

    try {
      const res = await axios.post(
        `${server}/message/create-new-message`,
        formData,
      );

      setMessages((prev) => [...prev, res.data.message]);
      UpdateLastMessage();
      setnewMessage("");
      setSelectedImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateLastMessage = async () => {
    const lastMessageText = newMessage.trim() || "Sent an image";
    socketId.emit("updateLastMessage", {
      lastMessage: lastMessageText,
      LastMessageId: user._id,
    });

    try {
      await axios.put(
        `${server}/conversation/update-last-message/${currentChat._id}`,
        {
          lastMessage: lastMessageText,
          LastMessageId: user._id,
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />
      <div className={chatShell.userRoot}>
        {!open ? (
          <div className="mt-2 rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] overflow-hidden flex flex-col max-h-[calc(100vh-7rem)]">
            <div className={chatShell.listHeader}>
              <h1 className={chatShell.listTitle}>Messages</h1>
              <p className={chatShell.listSubtitle}>
                Chat with shops you have contacted
              </p>
            </div>
            <div className={chatShell.listScroll}>
              {conversationsLoading ? (
                <ConversationListSkeleton />
              ) : conversations.length === 0 ? (
                <EmptyInboxIllustration
                  title="No conversations yet"
                  body="When you message a shop, the thread will show up here."
                />
              ) : (
                <div className="space-y-2 pb-2">
                  {conversations.map((item, index) => (
                    <MessageList
                      key={item._id || index}
                      data={item}
                      index={index}
                      setOpen={setOpen}
                      setCurrentChat={setCurrentChat}
                      selectedConversationId={currentChat?._id}
                      me={user._id}
                      onlineCheck={onlineCheck(item)}
                      setActiveStatus={setActiveStatus}
                      setUserData={setUserData}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <UserInbox
            onClose={() => {
              setOpen(false);
              setCurrentChat(null);
              setUserData(null);
            }}
            newMessage={newMessage}
            setnewMessage={setnewMessage}
            sendMessageHandler={sendMessageHandler}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            messages={messages}
            messagesLoading={messagesLoading}
            userId={user._id}
            userData={userData}
            activeStatus={activeStatus}
          />
        )}
      </div>
    </div>
  );
};

export const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  selectedConversationId,
  me,
  onlineCheck,
  setActiveStatus,
  setUserData,
}) => {
  const navigate = useNavigate();
  const [active, setactive] = useState(0);
  const [peer, setPeer] = useState(null);

  useEffect(() => {
    const userId = data.members.find((m) => m !== me);

    if (userId) {
      axios
        .get(`${server}/shop/get-shop-info/${userId}`)
        .then((res) => setPeer(res.data.shop))
        .catch(console.log);
    }
  }, [data, me]);

  useEffect(() => {
    if (selectedConversationId === data._id && peer) {
      setUserData(peer);
    }
  }, [peer, data._id, selectedConversationId, setUserData]);

  const handleClick = () => {
    setactive(index);
    setOpen(true);
    setCurrentChat(data);
    setUserData(peer);
    navigate(`?${data._id}`);
    setActiveStatus(onlineCheck);
  };

  const sentByMe = data?.LastMessageId === me;
  const peerFirst = (peer?.name || "Shop").split(" ")[0];
  const snippet = (data?.lastMessage || "").slice(0, 72);
  const preview = sentByMe
    ? `You · ${snippet || "—"}`
    : `${peerFirst} · ${snippet || "—"}`;

  return (
    <ConversationRow
      active={active === index}
      onClick={handleClick}
      avatarUrl={getAvatarUrl(backend_Url, peer?.avatar)}
      title={peer?.name}
      preview={preview}
      online={onlineCheck}
      loadingTitle={!peer?.name}
    />
  );
};

const UserInbox = ({
  onClose,
  newMessage,
  setnewMessage,
  sendMessageHandler,
  selectedImage,
  setSelectedImage,
  messages,
  messagesLoading,
  userId,
  userData,
  activeStatus,
}) => {
  return (
    <div className="mt-2 flex flex-col flex-1 min-h-[90vh] rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] overflow-hidden h-[min(85vh,calc(100vh-6rem))]">
      <ChatThreadHeader
        backendUrl={backend_Url}
        userData={userData}
        activeStatus={activeStatus}
        onBack={onClose}
        loading={!userData}
      />
      <MessageThread
        messages={messages}
        messagesLoading={messagesLoading}
        selfId={userId}
        backendUrl={backend_Url}
        loadingSkeleton={<MessageThreadSkeleton />}
      />
      <ChatComposer
        value={newMessage}
        onChange={(e) => setnewMessage(e.target.value)}
        onSubmit={sendMessageHandler}
        onImageChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
        selectedImageName={selectedImage?.name}
        selectedImagePreview={selectedImage}
        clearSelectedImage={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default UserInboxPage;
