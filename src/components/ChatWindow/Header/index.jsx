import { X, DotsThreeVertical } from "@phosphor-icons/react";
import { useState, useRef, useEffect } from "react";

export default function ChatWindowHeader({
  settings = {},
  iconUrl = null,
  closeChat,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleResetChat = () => {
    if (window.confirm("Are you sure you want to reset this chat?")) {
      window.dispatchEvent(new CustomEvent("anythingllm-embed-reset-chat"));
      setMenuOpen(false);
    }
  };

  return (
    <div 
      className="allm-flex allm-items-center allm-justify-between allm-px-7 allm-py-3.5 allm-rounded-t-[28px]"
      style={{
        background: "linear-gradient(135deg, rgb(25, 25, 25) 0%, rgb(0, 0, 0) 100%)",
        boxShadow: "0 1px 0 rgba(255, 255, 255, 0.08) inset, 0 2px 10px rgba(0, 0, 0, 0.2)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji'"
      }}
    >
      <div className="allm-flex allm-items-center allm-gap-4">
        <div 
          className="allm-w-10 allm-h-10 allm-rounded-full allm-overflow-hidden allm-border-2 allm-border-gray-800" 
          style={{
            boxShadow: "0 0 15px rgba(255, 255, 255, 0.15), 0 0 5px rgba(255, 154, 77, 0.2)"
          }}
        >
          <img
            src={iconUrl}
            alt="KIMBA Logo"
            className="allm-w-full allm-h-full allm-object-cover"
          />
        </div>
        <div className="allm-flex allm-flex-col allm-gap-0.5">
          <h1 
            className="allm-text-lg allm-font-bold allm-text-white allm-tracking-wide" 
            style={{ 
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji'",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)"
            }}
          >
            {settings.assistantName || "KIMBA"}
          </h1>
          <p 
            className="allm-text-xs allm-font-medium allm-text-gray-300" 
            style={{ 
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji'",
              letterSpacing: "0.02em"
            }}
          >
            Your Faithful Travel Companion
          </p>
        </div>
      </div>
      
      <div className="allm-flex allm-items-center allm-gap-3">
        <div className="allm-relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="allm-text-white/80 hover:allm-text-white allm-transition-all allm-bg-gray-800/60 allm-rounded-full allm-p-1.5 hover:allm-bg-gray-700/70 focus:allm-outline-none allm-w-7 allm-h-7 allm-flex allm-items-center allm-justify-center"
            style={{
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)"
            }}
            aria-label="Menu"
          >
            <DotsThreeVertical size={16} weight="bold" />
          </button>
          
          {menuOpen && (
            <div className="allm-absolute allm-right-0 allm-mt-1 allm-w-40 allm-rounded-md allm-shadow-lg allm-bg-white allm-ring-1 allm-ring-black allm-ring-opacity-5 allm-z-50">
              <div className="allm-py-1" role="menu" aria-orientation="vertical">
                <button
                  type="button"
                  className="allm-block allm-w-full allm-text-left allm-px-4 allm-py-2 allm-text-sm allm-text-gray-700 hover:allm-bg-gray-100"
                  role="menuitem"
                  onClick={handleResetChat}
                >
                  Reset Chat
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={closeChat}
          className="allm-text-white/80 hover:allm-text-white allm-transition-all allm-bg-gray-800/60 allm-rounded-full allm-p-1.5 hover:allm-bg-gray-700/70 focus:allm-outline-none allm-w-7 allm-h-7 allm-flex allm-items-center allm-justify-center"
          style={{
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)"
          }}
          aria-label="Close chat"
        >
          <X size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
}