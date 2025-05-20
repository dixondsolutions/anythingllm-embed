import React, { memo, forwardRef } from "react";
import { Warning } from "@phosphor-icons/react";
import renderMarkdown from "@/utils/chat/markdown";
import DOMPurify from "@/utils/chat/purify";
import { embedderSettings } from "@/main";
import { formatDate } from "@/utils/date";

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
    const textSize = !!embedderSettings.settings.textSize
      ? `allm-text-[${embedderSettings.settings.textSize}px]`
      : "allm-text-base";

    return (
      <div className="allm-py-2">
        <div
          key={uuid}
          ref={ref}
          className={`allm-flex allm-items-start allm-w-full allm-h-fit ${
            role === "user" ? "allm-justify-end" : "allm-justify-start"
          }`}
        >
          <div
            style={{
              backgroundColor:
                role === "user"
                  ? embedderSettings.USER_STYLES.msgBg
                  : embedderSettings.ASSISTANT_STYLES.msgBg,
            }}
            className={`allm-py-4 allm-px-6 allm-max-w-[85%] ${
              error
                ? "allm-bg-red-200 allm-rounded-2xl"
                : role === "user"
                ? "allm-rounded-2xl allm-text-white"
                : "allm-rounded-2xl allm-text-gray-700"
            } allm-shadow-sm`}
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
                <span
                  className={`allm-whitespace-pre-line ${textSize} allm-leading-relaxed`}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(renderMarkdown(message)),
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default memo(HistoricalMessage);