import React, { useEffect, useRef } from "react";
import { format } from "timeago.js";
import { AiOutlineArrowLeft, AiOutlineSend } from "react-icons/ai";
import { HiOutlinePhotograph } from "react-icons/hi";

/** Shared layout + bubbles for user inbox + seller dashboard */
export const chatShell = {
  dashboardRoot:
    "flex flex-col w-full max-w-5xl mx-auto m-3 h-[min(90vh,calc(100vh-5rem))] rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] overflow-hidden",
  userRoot:
    "w-full max-w-3xl mx-auto px-3 sm:px-4 pb-6 min-h-[calc(100vh-5rem)] flex flex-col",
  listHeader:
    "shrink-0 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white",
  listTitle: "text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight",
  listSubtitle: "text-sm text-slate-500 mt-0.5",
  listScroll: "flex-1 overflow-y-auto min-h-0 px-2 sm:px-3 py-2",
  emptyState:
    "flex flex-col items-center justify-center py-16 px-6 text-center text-slate-500",
};

export function getAvatarUrl(backendBase, path) {
  if (!path) return "";
  const s = String(path);
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `${backendBase}${s}`;
}

export function getMessageImageUrl(backendBase, path) {
  if (!path) return "";
  const s = String(path);
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return `${backendBase}${s.slice(1)}`;
  if (s.startsWith("uploads/")) return `${backendBase}${s}`;
  return `${backendBase}/${s}`;
}

export function Avatar({
  src,
  alt,
  size = "md",
  name,
  className = "",
}) {
  const sizeCls = {
    sm: "w-10 h-10 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-14 h-14 text-base",
  };
  const dim = sizeCls[size] || sizeCls.md;
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
  const [broken, setBroken] = React.useState(false);

  if (!src || broken) {
    return (
      <div
        className={`${dim} rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold flex items-center justify-center shrink-0 ring-2 ring-white shadow-sm ${className}`}
        aria-hidden
      >
        {initial}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt || ""}
      className={`${dim.split(" ").slice(0, 2).join(" ")} rounded-full object-cover shrink-0 ring-2 ring-white shadow-sm ${className}`}
      onError={() => setBroken(true)}
    />
  );
}

export function ConversationRow({
  active,
  onClick,
  avatarUrl,
  title,
  preview,
  online,
  loadingTitle,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 sm:p-4 rounded-xl text-left transition-all duration-200 border
        ${
          active
            ? "bg-emerald-50/90 border-emerald-200/80 shadow-sm"
            : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200/80"
        }`}
    >
      <div className="relative shrink-0">
        <Avatar src={avatarUrl} name={title} size="lg" />
        <span
          className={`absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm ${
            online ? "bg-emerald-500" : "bg-slate-300"
          }`}
          title={online ? "Online" : "Offline"}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900 truncate">
          {loadingTitle ? (
            <span className="inline-block h-4 w-28 bg-slate-200 rounded animate-pulse" />
          ) : (
            title || "Chat"
          )}
        </p>
        <p className="text-sm text-slate-500 truncate mt-0.5">{preview}</p>
      </div>
    </button>
  );
}

export function ChatThreadHeader({
  backendUrl,
  userData,
  activeStatus,
  onBack,
  loading,
}) {
  if (loading || !userData) {
    return (
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Back"
        >
          <AiOutlineArrowLeft size={22} />
        </button>
        <div className="h-11 w-11 rounded-full bg-slate-200 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(15,23,42,0.04)]">
      <button
        type="button"
        onClick={onBack}
        className="p-2 -ml-1 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Back to conversations"
      >
        <AiOutlineArrowLeft size={22} />
      </button>
      <Avatar
        src={getAvatarUrl(backendUrl, userData?.avatar)}
        name={userData?.name}
        size="md"
      />
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold text-slate-900 truncate text-lg leading-tight">
          {userData.name}
        </h2>
        <p className="text-xs sm:text-sm mt-0.5">
          {activeStatus ? (
            <span className="text-emerald-600 font-medium">● Active now</span>
          ) : (
            <span className="text-slate-400">Offline</span>
          )}
        </p>
      </div>
    </div>
  );
}

export function MessageBubble({ text, time, isOwn, images = [], backendUrl }) {
  return (
    <div
      className={`flex w-full mb-3 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[min(85%,28rem)] rounded-2xl px-4 py-2.5 shadow-sm ${
          isOwn
            ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-br-md"
            : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-md"
        }`}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
          {text}
        </p>
        {images?.length > 0 && (
          <div className="mt-2 space-y-2">
            {images.map((img, idx) => (
              <a
                key={`${img}-${idx}`}
                href={getMessageImageUrl(backendUrl, img)}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <img
                  src={getMessageImageUrl(backendUrl, img)}
                  alt="Message attachment"
                  className="max-w-full max-h-64 rounded-lg object-cover border border-slate-200/70"
                />
              </a>
            ))}
          </div>
        )}
        <p
          className={`text-[11px] mt-1.5 ${
            isOwn ? "text-emerald-100/90" : "text-slate-400"
          }`}
        >
          {format(time)}
        </p>
      </div>
    </div>
  );
}

export function MessageThread({
  messages,
  messagesLoading,
  selfId,
  loadingSkeleton,
  backendUrl,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesLoading]);

  if (messagesLoading) {
    return <div className="flex-1 min-h-0 overflow-y-auto">{loadingSkeleton}</div>;
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-4 bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
      {messages.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-12">
          No messages yet. Say hello!
        </p>
      ) : (
        messages.map((msg, i) => (
          <MessageBubble
            key={msg._id || i}
            text={msg.text}
            images={msg.images}
            time={msg.createdAt}
            isOwn={msg.sender === selfId}
            backendUrl={backendUrl}
          />
        ))
      )}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  onImageChange,
  selectedImageName,
  selectedImagePreview,
  clearSelectedImage,
  placeholder = "Type a message…",
  inputClassName = "",
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3 border-t border-slate-100 bg-white"
    >
      <label
        className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
        title="Attach image"
      >
        <HiOutlinePhotograph size={22} />
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
        />
      </label>
      {selectedImageName ? (
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 max-w-[180px] truncate">
          <span className="truncate">{selectedImageName}</span>
          <button
            type="button"
            onClick={clearSelectedImage}
            className="text-rose-500 hover:text-rose-600"
            title="Remove image"
          >
            Remove
          </button>
        </div>
      ) : null}
      <input
        value={value}
        onChange={onChange}
        className={`flex-1 min-w-0 rounded-full border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-shadow ${inputClassName}`}
        placeholder={placeholder}
      />
      <button
        type="submit"
        className="shrink-0 p-3 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/25 hover:brightness-105 active:scale-95 transition-all disabled:opacity-40"
        disabled={!String(value || "").trim() && !selectedImagePreview}
        aria-label="Send"
      >
        <AiOutlineSend size={20} />
      </button>
    </form>
  );
}

export function EmptyInboxIllustration({ title, body }) {
  return (
    <div className={chatShell.emptyState}>
      <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 text-2xl font-bold">
        💬
      </div>
      <p className="font-medium text-slate-700">{title}</p>
      <p className="text-sm mt-1 max-w-xs">{body}</p>
    </div>
  );
}
