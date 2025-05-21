import ChatWindowHeader from "./Header";
import SessionId from "../SessionId";
import useChatHistory from "@/hooks/chat/useChatHistory";
import ChatContainer from "./ChatContainer";
import { ChatHistoryLoading } from "./ChatContainer/ChatHistory";

export default function ChatWindow({ closeChat, settings, sessionId }) {
  const { chatHistory, setChatHistory, loading } = useChatHistory(
    settings,
    sessionId
  );

  if (loading) {
    return (
      <div className="allm-flex allm-flex-col allm-h-full allm-relative">
        <div className="allm-absolute allm-top-0 allm-left-0 allm-right-0 allm-z-30">
          <ChatWindowHeader
            sessionId={sessionId}
            settings={settings}
            iconUrl={settings.brandImageUrl}
            closeChat={closeChat}
            setChatHistory={setChatHistory}
          />
        </div>
        <div className="allm-flex-grow allm-bg-white allm-pt-16">
          <ChatHistoryLoading />
        </div>
      </div>
    );
  }

  setEventDelegatorForCodeSnippets();

  return (
    <div 
      className="allm-flex allm-flex-col allm-h-full allm-overflow-hidden allm-relative"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji'",
        background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 1) 100%)",
        borderRadius: "28px 28px 0 0",
        boxShadow: "0 0 30px rgba(0, 0, 0, 0.08), 0 0 10px rgba(0, 0, 0, 0.04)",
        border: "1px solid rgba(0, 0, 0, 0.04)",
        borderBottom: "none",
        marginBottom: "-2px",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: "100%"
      }}
    >
      {!settings.noHeader && (
        <div className="allm-absolute allm-top-0 allm-left-0 allm-right-0 allm-z-50">
          <ChatWindowHeader
            sessionId={sessionId}
            settings={settings}
            iconUrl={settings.brandImageUrl}
            closeChat={closeChat}
            setChatHistory={setChatHistory}
          />
        </div>
      )}
      <div className="allm-flex-grow allm-overflow-hidden allm-flex allm-flex-col">
        <div className="allm-pt-16 allm-h-full allm-overflow-hidden allm-relative allm-flex-1">
          <ChatContainer
            sessionId={sessionId}
            settings={settings}
            knownHistory={chatHistory}
          />
        </div>
      </div>
    </div>
  );
}

function copyCodeSnippet(uuid) {
  const target = document.querySelector(`[data-code="${uuid}"]`);
  if (!target) return false;

  const markdown =
    target.parentElement?.parentElement?.querySelector(
      "pre:first-of-type"
    )?.innerText;
  if (!markdown) return false;

  window.navigator.clipboard.writeText(markdown);

  target.classList.add("allm-text-green-500");
  const originalText = target.innerHTML;
  target.innerText = "Copied!";
  target.setAttribute("disabled", true);

  setTimeout(() => {
    target.classList.remove("allm-text-green-500");
    target.innerHTML = originalText;
    target.removeAttribute("disabled");
  }, 2500);
}

const setEventDelegatorForCodeSnippets = () => {
  document?.addEventListener("click", (e) => {
    const target = e.target.closest("[data-code-snippet]");
    const uuidCode = target?.dataset?.code;
    if (!uuidCode) return false;
    copyCodeSnippet(uuidCode);
  });
}