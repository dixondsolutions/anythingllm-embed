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
  }, []);

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
    
    return () => {
      if (chatHistoryRef.current) {
        chatHistoryRef.current.removeEventListener("scroll", debouncedScroll);
      }
    };
  }, [debouncedScroll]);

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
      <div className="allm-h-full allm-overflow-y-auto allm-px-6 allm-py-5 allm-flex allm-flex-col allm-justify-start allm-overflow-hidden">
        <div className="allm-flex allm-h-full allm-flex-col allm-items-center allm-justify-start allm-gap-y-6 allm-pt-4 allm-pb-10">
          <div 
            className="allm-bg-[#FBE7C6] allm-rounded-2xl allm-w-full allm-shadow-md allm-transform allm-transition-all" 
            style={{
              boxShadow: "0 4px 12px rgba(251, 231, 198, 0.5), 0 1px 3px rgba(251, 231, 198, 0.3)"
            }}
          >
            <p className="allm-text-gray-800 allm-text-[16px] allm-leading-relaxed allm-font-normal allm-py-5 allm-px-6">
              Hi! Let me help you plan the perfect trip! Just let me know what you're interested in. I can help find new and interesting places for you to explore, or just a place to rest your head. I cannot directly book trips or assist with reservation information. I may sometimes get things wrong, so always double check availabilities!
            </p>
          </div>
          <SuggestedMessages settings={settings} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="allm-h-full allm-overflow-y-auto allm-px-6 allm-py-5 allm-flex allm-flex-col allm-justify-start allm-no-scroll"
      id="chat-history"
      ref={chatHistoryRef}
    >
      <div className="allm-flex allm-flex-col allm-gap-y-3 allm-pb-10 allm-pt-4">
        {history.map((props, index) => {
          const isLastMessage = index === history.length - 1;
          const isLastBotReply =
            index === history.length - 1 && props.role === "assistant";
          const messageKey = props.uuid || `message-${props.role}-${props.sentAt || index}`;

          if (isLastBotReply && props.animate) {
            return (
              <PromptReply
                key={messageKey}
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
              key={messageKey}
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
        <div className="allm-fixed allm-bottom-[8rem] allm-right-[50px] allm-z-20 allm-cursor-pointer allm-animate-pulse">
          <div className="allm-flex allm-flex-col allm-items-center">
            <div className="allm-rounded-full allm-border allm-border-white/10 allm-bg-black/20 hover:allm-bg-black/50 allm-w-8 allm-h-8 allm-flex allm-items-center allm-justify-center allm-shadow-md">
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
  const defaultMessages = [
    "Where should I stay?",
    "What activities are available?",
    "Tell me about local restaurants"
  ];
  
  const messages = settings?.defaultMessages?.length ? settings.defaultMessages : defaultMessages;

  return (
    <div className="allm-flex allm-flex-col allm-gap-y-3 allm-w-full">
      {messages.map((content, i) => {
        const buttonId = `suggestion-${content.replace(/\s+/g, '-').toLowerCase()}`;
        return (
          <button
            key={buttonId}
            style={{
              backgroundColor: "#E27B3F",
              boxShadow: "0 4px 12px rgba(226, 123, 63, 0.25), 0 1px 3px rgba(226, 123, 63, 0.15)"
            }}
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent(SEND_TEXT_EVENT, { detail: { command: content } })
              );
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.dispatchEvent(
                  new CustomEvent(SEND_TEXT_EVENT, { detail: { command: content } })
                );
              }
            }}
            className="allm-text-white allm-py-3 allm-px-5 allm-rounded-xl allm-text-left hover:allm-opacity-95 hover:allm-translate-y-[-1px] allm-transition-all allm-border-none allm-cursor-pointer allm-font-medium allm-text-sm"
          >
            {content}
          </button>
        );
      })}
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