import HistoricalMessage from "./HistoricalMessage";
import PromptReply from "./PromptReply";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, CircleNotch } from "@phosphor-icons/react";
import { embedderSettings } from "@/main";
import debounce from "lodash.debounce";
import { SEND_TEXT_EVENT } from "..";

export default function ChatHistory({ settings = {}, history = [] }) {
  const replyRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleScroll = () => {
    if (!chatHistoryRef.current) return;
    const diff =
      chatHistoryRef.current.scrollHeight -
      chatHistoryRef.current.scrollTop -
      chatHistoryRef.current.clientHeight;
    const isBottom = diff <= 40;
    setIsAtBottom(isBottom);
  };

  const debouncedScroll = debounce(handleScroll, 100);
  useEffect(() => {
    function watchScrollEvent() {
      if (!chatHistoryRef.current) return null;
      const chatHistoryElement = chatHistoryRef.current;
      if (!chatHistoryElement) return null;
      chatHistoryElement.addEventListener("scroll", debouncedScroll);
    }
    watchScrollEvent();
  }, []);

  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  if (history.length === 0) {
    return (
      <div className="allm-h-full allm-overflow-y-auto allm-px-6 allm-py-6 allm-flex allm-flex-col allm-justify-start allm-no-scroll">
        <div className="allm-flex allm-h-full allm-flex-col allm-items-center allm-justify-center">
          <p className="allm-text-gray-700 allm-text-base allm-font-sans allm-py-6 allm-px-8 allm-text-center allm-bg-[#FBE7C6] allm-rounded-2xl allm-mb-8 allm-leading-relaxed allm-max-w-[85%]">
            {settings?.greeting ?? "Send a chat to get started."}
          </p>
          <SuggestedMessages settings={settings} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="allm-h-full allm-overflow-y-auto allm-px-6 allm-py-6 allm-flex allm-flex-col allm-justify-start allm-no-scroll"
      id="chat-history"
      ref={chatHistoryRef}
    >
      <div className="allm-flex allm-flex-col allm-gap-y-4">
        {history.map((props, index) => {
          const isLastMessage = index === history.length - 1;
          const isLastBotReply =
            index === history.length - 1 && props.role === "assistant";

          if (isLastBotReply && props.animate) {
            return (
              <PromptReply
                key={props.uuid}
                ref={isLastMessage ? replyRef : null}
                uuid={props.uuid}
                reply={props.content}
                pending={props.pending}
                sources={props.sources}
                error={props.error}
                closed={props.closed}
              />
            );
          }

          return (
            <HistoricalMessage
              key={index}
              ref={isLastMessage ? replyRef : null}
              message={props.content}
              sentAt={props.sentAt || Date.now() / 1000}
              role={props.role}
              sources={props.sources}
              chatId={props.chatId}
              feedbackScore={props.feedbackScore}
              error={props.error}
              errorMsg={props.errorMsg}
            />
          );
        })}
      </div>
      {!isAtBottom && (
        <div className="allm-fixed allm-bottom-[10rem] allm-right-[50px] allm-z-50 allm-cursor-pointer allm-animate-pulse">
          <div className="allm-flex allm-flex-col allm-items-center">
            <div className="allm-rounded-full allm-border allm-border-white/10 allm-bg-black/20 hover:allm-bg-black/50 allm-w-8 allm-h-8 allm-flex allm-items-center allm-justify-center">
              <ArrowDown
                weight="bold"
                className="allm-text-white/50 allm-w-4 allm-h-4"
                onClick={scrollToBottom}
                id="scroll-to-bottom-button"
                aria-label="Scroll to bottom"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SuggestedMessages({ settings }) {
  if (!settings?.defaultMessages?.length) return null;

  return (
    <div className="allm-flex allm-flex-col allm-gap-y-3 allm-w-full allm-max-w-[85%]">
      {settings.defaultMessages.map((content, i) => (
        <button
          key={i}
          style={{
            backgroundColor: embedderSettings.USER_STYLES.msgBg,
          }}
          type="button"
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent(SEND_TEXT_EVENT, { detail: { command: content } })
            );
          }}
          className="allm-text-white allm-py-4 allm-px-6 allm-rounded-2xl allm-text-left hover:allm-opacity-90 allm-transition-opacity allm-border-none allm-cursor-pointer allm-shadow-sm allm-text-base"
        >
          {content}
        </button>
      ))}
    </div>
  );
}

export function ChatHistoryLoading() {
  return (
    <div className="allm-h-full allm-w-full allm-relative">
      <div className="allm-h-full allm-flex allm-items-center allm-justify-center">
        <CircleNotch size={24} className="allm-text-gray-400 allm-animate-spin" />
      </div>
    </div>
  );
}