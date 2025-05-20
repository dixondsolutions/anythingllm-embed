import { X } from "@phosphor-icons/react";

export default function ChatWindowHeader({
  settings = {},
  iconUrl = null,
  closeChat,
}) {
  return (
    <div className="allm-flex allm-items-center allm-justify-between allm-px-6 allm-py-4 allm-bg-[#2C2C2C] allm-rounded-t-3xl">
      <div className="allm-flex allm-items-center allm-gap-3">
        <img
          src={iconUrl}
          alt="Brand Logo"
          className="allm-w-12 allm-h-12 allm-rounded-full"
        />
        <div className="allm-flex allm-flex-col">
          <h1 className="allm-text-xl allm-font-bold allm-text-white">
            {settings.assistantName || "KIMBA"}
          </h1>
          <p className="allm-text-sm allm-text-white/80">
            Your Faithful Travel Companion
          </p>
        </div>
      </div>
      <button
        onClick={closeChat}
        className="allm-text-white/80 hover:allm-text-white allm-transition-colors allm-bg-transparent allm-border-none"
      >
        <X size={24} weight="bold" />
      </button>
    </div>
  );
}