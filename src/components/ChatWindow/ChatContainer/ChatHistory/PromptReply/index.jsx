import { forwardRef, memo, useState, useEffect, useRef } from "react";
import { Warning, CircleNotch, CaretDown } from "@phosphor-icons/react";
import renderMarkdown from "@/utils/chat/markdown";
import { embedderSettings } from "@/main";
import AnythingLLMIcon from "@/assets/anything-llm-icon.svg";
import { formatDate } from "@/utils/date";
import DOMPurify from "@/utils/chat/purify";

// Helper function to safely render content without using dangerouslySetInnerHTML
const SafeContent = ({ content }) => {
  // Use an empty div as a container
  const contentRef = useRef(null);
  
  // Set innerHTML only after the component mounts
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = DOMPurify.sanitize(renderMarkdown(content || ""));
    }
  }, [content]);
  
  return (
    <div 
      ref={contentRef} 
      className="allm-whitespace-pre-line allm-leading-relaxed allm-font-normal allm-text-base allm-flex allm-flex-col allm-gap-y-2" 
      style={{ 
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji'",
        color: "inherit"
      }} 
    />
  );
};

const ThinkingIndicator = ({ hasThought }) => {
  if (hasThought) {
    return (
      <div className="allm-flex allm-items-center allm-gap-x-2 allm-text-gray-500">
        <CircleNotch size={16} className="allm-animate-spin" />
        <span className="allm-text-sm">Thinking...</span>
      </div>
    );
  }
  return <div className="allm-mx-4 allm-my-1 allm-dot-falling" />;
};

const ThoughtBubble = ({ thought }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!thought || !embedderSettings.settings.showThoughts) return null;

  const cleanThought = thought.replace(/<\/?think>/g, "").trim();

  return (
    <div className="allm-mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
        className="allm-cursor-pointer allm-flex allm-items-center allm-gap-x-1.5 allm-text-gray-400 hover:allm-text-gray-500 allm-bg-transparent allm-border-none allm-p-0"
      >
        <CaretDown
          size={14}
          weight="bold"
          className={`allm-transition-transform ${isExpanded ? "allm-rotate-180" : ""}`}
        />
        <span className="allm-text-xs allm-font-medium">View thoughts</span>
      </button>
      {isExpanded && (
        <div className="allm-mt-2 allm-mb-3 allm-pl-0 allm-border-l-2 allm-border-gray-200">
          <div className="allm-text-xs allm-text-gray-600 allm-font-mono allm-whitespace-pre-wrap">
            {cleanThought}
          </div>
        </div>
      )}
    </div>
  );
};

const PromptReply = forwardRef(
  ({ uuid, reply, pending, error, sources = [], sentAt }, ref) => {
    if (!reply && sources.length === 0 && !pending && !error) return null;
    if (error) console.error(`ANYTHING_LLM_CHAT_WIDGET_ERROR: ${error}`);

    // Extract content between think tags if they exist
    const thinkMatches = reply?.match(/<think>([\s\S]*?)<\/think>/g) || [];
    const thoughts = thinkMatches.map((match) =>
      match.replace(/<\/?think>/g, "").trim()
    );

    const hasIncompleteThinkTag =
      reply?.includes("<think>") && !reply?.includes("</think>");

    // For incomplete think tags during streaming, extract the content after the opening tag
    const streamingThought = hasIncompleteThinkTag
      ? reply
          ?.split("<think>")
          .pop()
          ?.replace(/<\/?think>/g, "")
          .trim()
      : null;

    const lastThought = streamingThought || thoughts[thoughts.length - 1];
    const isThinking = hasIncompleteThinkTag || pending;

    // Get the response content without the think tags - clean more aggressively
    const responseContent = reply
      ?.replace(/<think>[\s\S]*?<\/think>/g, "") // Remove complete think blocks
      .replace(/<think>.*$/g, "") // Remove any incomplete think blocks at the end
      .replace(/<\/?think>/g, "") // Remove any stray think tags
      .trim();

    if (isThinking) {
      return (
        <div className="allm-py-2.5">
          <div className="allm-flex allm-items-start allm-w-full allm-h-fit allm-justify-start">
            <div
              style={{
                backgroundColor: "#FBE7C6",
                boxShadow: "0 6px 16px rgba(251, 231, 198, 0.25), 0 2px 5px rgba(251, 231, 198, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.5)",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji'",
                color: "#33302E",
                transform: "translateZ(0)",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease-in-out"
              }}
              className="allm-py-3.5 allm-px-5 allm-rounded-xl allm-max-w-[85%]"
            >
              {hasIncompleteThinkTag && streamingThought && (
                <ThoughtBubble thought={streamingThought} />
              )}
              <ThinkingIndicator hasThought={hasIncompleteThinkTag} />
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="allm-py-2.5">
          <div className="allm-flex allm-items-start allm-w-full allm-h-fit allm-justify-start">
            <div 
              className="allm-py-3.5 allm-px-5 allm-rounded-xl allm-max-w-[85%] allm-bg-red-100 allm-text-red-600" 
              style={{ 
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji'",
                boxShadow: "0 6px 16px rgba(251, 100, 100, 0.15), 0 2px 5px rgba(251, 100, 100, 0.1)"
              }}
            >
              <div className="allm-flex allm-flex-col allm-gap-y-2">
                <span className="allm-flex allm-items-center allm-gap-x-2">
                  <Warning className="allm-h-4 allm-w-4" />
                  <span className="allm-font-medium">Could not respond to message</span>
                </span>
                <p className="allm-text-sm allm-bg-red-50 allm-p-2 allm-rounded-md">
                  Server error
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="allm-py-2.5">
        <div
          key={uuid}
          ref={ref}
          className="allm-flex allm-items-start allm-w-full allm-h-fit allm-justify-start"
        >
          <div
            style={{
              backgroundColor: "#FBE7C6",
              boxShadow: "0 6px 16px rgba(251, 231, 198, 0.25), 0 2px 5px rgba(251, 231, 198, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.5)",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji'",
              color: "#33302E",
              transform: "translateZ(0)",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s ease-in-out"
            }}
            className="allm-py-3.5 allm-px-5 allm-rounded-xl allm-max-w-[85%]"
          >
            {thoughts.length > 0 && (
              <ThoughtBubble thought={thoughts.join("\n\n")} />
            )}
            <div>
              <SafeContent content={responseContent} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default memo(PromptReply);


