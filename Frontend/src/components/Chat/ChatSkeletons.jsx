import React from "react";

/** Skeleton rows for the “All Messages” list */
export function ConversationListSkeleton({ rows = 6 }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="w-full flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-slate-100 bg-slate-50/80 animate-pulse"
        >
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full bg-slate-200" />
            <div className="w-3.5 h-3.5 bg-slate-300 rounded-full absolute bottom-0.5 right-0.5 border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0 space-y-2 pt-0.5">
            <div className="h-4 bg-slate-200 rounded-md w-[38%] max-w-[160px]" />
            <div className="h-3 bg-slate-100 rounded-md w-[72%] max-w-[260px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton bubbles inside the open chat (message thread) */
export function MessageThreadSkeleton({ bubbles = 7 }) {
  return (
    <div
      className="space-y-3 px-3 sm:px-4 py-4 animate-pulse bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] min-h-[200px]"
      aria-hidden="true"
    >
      {Array.from({ length: bubbles }).map((_, i) => {
        const alignRight = i % 3 === 0;
        const widthClass = alignRight ? "w-44 sm:w-52" : "w-36 sm:w-44";
        return (
          <div
            key={i}
            className={`flex mb-1 ${alignRight ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex flex-col gap-1 max-w-[85%] ${alignRight ? "items-end" : "items-start"}`}
            >
              <div
                className={`rounded-2xl p-3 h-10 ${alignRight ? "bg-emerald-200/80" : "bg-white border border-slate-200"} ${widthClass}`}
              />
              <div className="h-2 bg-slate-200/80 rounded w-14" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ChatHeaderSkeleton() {
  return (
    <div
      className="flex justify-between items-center p-3 border-b border-slate-100 bg-white animate-pulse"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <div className="w-[50px] h-[50px] rounded-full bg-slate-200 shrink-0" />
        <div className="space-y-2">
          <div className="h-5 bg-slate-200 rounded-md w-36" />
          <div className="h-3 bg-slate-100 rounded-md w-20" />
        </div>
      </div>
      <div className="w-6 h-6 bg-slate-200 rounded shrink-0" />
    </div>
  );
}
