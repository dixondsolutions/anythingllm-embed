import { CircleNotch } from "@phosphor-icons/react";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function PromptInput({
  settings,
  message,
  submit,
  onChange,
  inputDisabled,
  buttonDisabled,
}) {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const textareaRef = useRef(null);
  const [isFocused, setFocused] = useState(false);

  useEffect(() => {
    if (!inputDisabled && textareaRef.current) {
      textareaRef.current.focus();
    }
    resetTextAreaHeight();
  }, [inputDisabled]);

  const handleSubmit = (e) => {
    setFocused(false);
    submit(e);
  };

  const resetTextAreaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const captureEnter = (event) => {
    if (event.keyCode === 13) {
      if (!event.shiftKey) {
        submit(event);
      }
    }
  };

  const adjustTextArea = (event) => {
    const element = event.target;
    element.style.height = "auto";
    element.style.height =
      event.target.value.length !== 0 ? `${element.scrollHeight}px` : "auto";
  };

  return (
    <div className="allm-w-full allm-sticky allm-bottom-0 allm-z-50 allm-flex allm-flex-col allm-justify-end allm-items-center allm-bg-transparent">      
      <form
        onSubmit={handleSubmit}
        className="allm-flex allm-flex-col allm-w-full allm-items-center allm-justify-center"
      >
        <div 
          className="allm-bg-white allm-flex allm-flex-col allm-overflow-hidden allm-w-full allm-border-t allm-border-gray-100"
          style={{
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.03)"
          }}
        >
          <textarea
            ref={textareaRef}
            onKeyUp={adjustTextArea}
            onKeyDown={captureEnter}
            onChange={onChange}
            required={true}
            disabled={inputDisabled}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              setFocused(false);
              adjustTextArea(e);
            }}
            value={message}
            className={`allm-font-sans allm-border-none allm-cursor-text allm-max-h-[60px] allm-text-[15px] allm-mx-8 allm-my-4 allm-w-auto allm-bg-transparent allm-resize-none active:allm-outline-none focus:allm-outline-none ${isFocused ? 'allm-text-gray-800 placeholder:allm-text-gray-400' : 'allm-text-gray-600 placeholder:allm-text-gray-400'}`}
            placeholder="Type your message..."
            id="message-input"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji'",
              transition: "color 0.2s ease-in-out"
            }}
          />
        </div>
        <div className="allm-w-full allm-px-0 allm-pb-0 allm-leading-[0] allm-block" style={{ display: "block", lineHeight: 0, margin: 0, padding: 0 }}>
          <button
            ref={formRef}
            type="submit"
            disabled={buttonDisabled}
            style={{ 
              background: buttonDisabled 
                ? "#E27B3F" 
                : "linear-gradient(to bottom, #E9935B 0%, #E27B3F 100%)",
              boxShadow: "0 6px 16px rgba(226, 123, 63, 0.25), 0 2px 5px rgba(226, 123, 63, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
              borderRadius: "0",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji'",
              transition: "all 0.2s ease-in-out",
              margin: 0,
              padding: "14px 0",
              border: "none",
              display: "block",
              width: "100%",
              position: "relative",
              bottom: 0,
              left: 0,
              right: 0
            }}
            className="allm-w-full allm-text-white hover:allm-opacity-95 allm-transition-all allm-font-semibold allm-text-lg hover:allm-translate-y-[-1px]"
            id="send-message-button"
            aria-label="Send message"
          >
            {buttonDisabled ? (
              <CircleNotch className="allm-w-5 allm-h-5 allm-animate-spin allm-mx-auto" />
            ) : (
              "SEND"
            )}
            <span className="allm-sr-only">Send message</span>
          </button>
        </div>
      </form>
    </div>
  );
}