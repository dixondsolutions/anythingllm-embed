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
    if (event.keyCode == 13) {
      if (!event.shiftKey) {
        submit(event);
      }
    }
  };

  const adjustTextArea = (event) => {
    const element = event.target;
    element.style.height = "auto";
    element.style.height =
      event.target.value.length !== 0 ? element.scrollHeight + "px" : "auto";
  };

  return (
    <div className="allm-w-full allm-sticky allm-bottom-0 allm-z-10 allm-flex allm-justify-center allm-items-center allm-bg-transparent allm-px-6 allm-pb-6">
      <form
        onSubmit={handleSubmit}
        className="allm-flex allm-flex-col allm-gap-y-1 allm-w-full allm-items-center allm-justify-center"
      >
        <div className="allm-flex allm-items-center allm-w-full allm-gap-x-3">
          <div className="allm-flex-1 allm-bg-gray-100 allm-rounded-2xl allm-px-4 allm-py-3">
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
              className="allm-font-sans allm-border-none allm-cursor-text allm-max-h-[100px] allm-text-base allm-w-full allm-text-gray-700 allm-bg-transparent placeholder:allm-text-gray-500 allm-resize-none active:allm-outline-none focus:allm-outline-none"
              placeholder={settings.sendMessageText || t("chat.send-message")}
              id="message-input"
            />
          </div>
          <button
            ref={formRef}
            type="submit"
            disabled={buttonDisabled}
            style={{ backgroundColor: settings.buttonColor || '#E27B3F' }}
            className="allm-px-8 allm-py-3 allm-rounded-2xl allm-text-white hover:allm-opacity-90 allm-transition-opacity allm-font-semibold"
            id="send-message-button"
            aria-label="Send message"
          >
            {buttonDisabled ? (
              <CircleNotch className="allm-w-5 allm-h-5 allm-animate-spin" />
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