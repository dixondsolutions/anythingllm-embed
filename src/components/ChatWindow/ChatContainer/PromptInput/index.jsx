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
  const [_, setFocused] = useState(false);

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
    <div className="allm-w-full allm-sticky allm-bottom-0 allm-z-10 allm-flex allm-flex-col allm-justify-center allm-items-center allm-bg-transparent">      
      <form
        onSubmit={handleSubmit}
        className="allm-flex allm-flex-col allm-w-full allm-items-center allm-justify-center"
      >
        <div className="allm-bg-white allm-flex allm-flex-col allm-overflow-hidden allm-w-full allm-border-t allm-border-gray-100">
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
            className="allm-font-sans allm-border-none allm-cursor-text allm-max-h-[60px] allm-text-[15px] allm-mx-8 allm-my-4 allm-w-auto allm-text-gray-600 allm-bg-transparent placeholder:allm-text-gray-400 allm-resize-none active:allm-outline-none focus:allm-outline-none"
            placeholder="Type your message..."
            id="message-input"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji'"
            }}
          />
        </div>
        <div className="allm-w-full allm-px-3 allm-pb-3">
          <button
            ref={formRef}
            type="submit"
            disabled={buttonDisabled}
            style={{ 
              backgroundColor: "#E27B3F",
              boxShadow: "0 4px 12px rgba(226, 123, 63, 0.35), 0 1px 3px rgba(226, 123, 63, 0.2)",
              borderRadius: "0 0 0 0",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji'"
            }}
            className="allm-w-full allm-px-8 allm-py-3 allm-text-white hover:allm-opacity-95 allm-transition-all allm-font-semibold allm-text-lg"
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