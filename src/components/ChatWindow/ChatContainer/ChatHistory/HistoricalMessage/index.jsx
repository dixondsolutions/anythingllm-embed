import React, { memo, forwardRef } from "react";
import { Warning } from "@phosphor-icons/react";
import renderMarkdown from "@/utils/chat/markdown";
import DOMPurify from "@/utils/chat/purify";
import { embedderSettings } from "@/main";
import { formatDate } from "@/utils/date";

// Helper function to safely render content without using dangerouslySetInnerHTML
const SafeContent = ({ content }) => {
  // Use an empty div as a container
  const contentRef = React.useRef(null);
  
  // Set innerHTML only after the component mounts
  React.useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = DOMPurify.sanitize(renderMarkdown(content));
    }
  }, [content]);
  
  return (
    <div 
      ref={contentRef} 
      className="allm-whitespace-pre-line allm-leading-relaxed" 
      style={{ 
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji'",
        color: "inherit"
      }} 
    />
  );
};

const HistoricalMessage = forwardRef(
  (
    {
      uuid,
      message,
      role,
      sources = [],
      error = false,
      errorMsg = null,
      sentAt,
    },
    ref
  ) => {
    const textSize = embedderSettings.settings.textSize
      ? `allm-text-[${embedderSettings.settings.textSize}px]`
      : "allm-text-base";

    const isUser = role === "user";
    
    return (
      <div className="allm-py-2.5">
        <div
          key={uuid}
          ref={ref}
          className={`allm-flex allm-items-start allm-w-full allm-h-fit ${
            isUser ? "allm-justify-end" : "allm-justify-start"
          }`}
        >
          <div
            style={{
              backgroundColor: isUser 
                ? "#E27B3F" 
                : "#FBE7C6",
              boxShadow: isUser
                ? "0 6px 16px rgba(226, 123, 63, 0.25), 0 2px 5px rgba(226, 123, 63, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.2)"
                : "0 6px 16px rgba(251, 231, 198, 0.25), 0 2px 5px rgba(251, 231, 198, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.5)",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji'",
              color: isUser ? "#ffffff" : "#33302E",
              transform: "translateZ(0)",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s ease-in-out"
            }}
            className={`allm-py-3.5 allm-px-5 allm-max-w-[85%] ${
              error
                ? "allm-bg-red-200 allm-rounded-xl"
                : isUser
                ? "allm-rounded-xl allm-text-white"
                : "allm-rounded-xl"
            }`}
          >
            <div className="allm-flex allm-flex-col">
              {error ? (
                <div className="allm-p-2 allm-rounded-lg allm-bg-red-50 allm-text-red-500">
                  <span className="allm-inline-block">
                    <Warning className="allm-h-4 allm-w-4 allm-mb-1 allm-inline-block" />{" "}
                    Could not respond to message.
                  </span>
                  <p className="allm-text-xs allm-font-mono allm-mt-2 allm-border-l-2 allm-border-red-500 allm-pl-2 allm-bg-red-300 allm-p-2 allm-rounded-sm">
                    {errorMsg || "Server error"}
                  </p>
                </div>
              ) : (
                <span className={`${textSize}`}>
                  <SafeContent content={message} />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default memo(HistoricalMessage);