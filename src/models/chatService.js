import { fetchEventSource } from "@microsoft/fetch-event-source";
import { v4 } from "uuid";

const ChatService = {
  embedSessionHistory: async function (embedSettings, sessionId) {
    try {
      const { embedId, baseApiUrl } = embedSettings;
      const protocol = window.location.protocol;
      // Make sure we're using the same protocol (http or https) as the parent page
      const apiUrl = baseApiUrl.startsWith('//') ? 
        `${protocol}${baseApiUrl}` : 
        baseApiUrl.replace(/^https?:/, protocol);

      return await fetch(`${apiUrl}/${embedId}/${sessionId}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Invalid response from server");
        })
        .then((res) => {
          return res.history.map((msg) => ({
            ...msg,
            id: v4(),
            sender: msg.role === "user" ? "user" : "system",
            textResponse: msg.content,
            close: false,
          }));
        });
    } catch (e) {
      console.error("Error fetching chat history:", e);
      return [];
    }
  },
  resetEmbedChatSession: async function (embedSettings, sessionId) {
    try {
      const { baseApiUrl, embedId } = embedSettings;
      const protocol = window.location.protocol;
      // Make sure we're using the same protocol (http or https) as the parent page
      const apiUrl = baseApiUrl.startsWith('//') ? 
        `${protocol}${baseApiUrl}` : 
        baseApiUrl.replace(/^https?:/, protocol);

      return await fetch(`${apiUrl}/${embedId}/${sessionId}`, {
        method: "DELETE",
      })
        .then((res) => res.ok)
        .catch(() => false);
    } catch (e) {
      console.error("Error resetting chat session:", e);
      return false;
    }
  },
  streamChat: async function (sessionId, embedSettings, message, handleChat) {
    try {
      const { baseApiUrl, embedId, username } = embedSettings;
      const protocol = window.location.protocol;
      // Make sure we're using the same protocol (http or https) as the parent page
      const apiUrl = baseApiUrl.startsWith('//') ? 
        `${protocol}${baseApiUrl}` : 
        baseApiUrl.replace(/^https?:/, protocol);

      const overrides = {
        prompt: embedSettings?.prompt ?? null,
        model: embedSettings?.model ?? null,
        temperature: embedSettings?.temperature ?? null,
      };

      const ctrl = new AbortController();
      await fetchEventSource(`${apiUrl}/${embedId}/stream-chat`, {
        method: "POST",
        body: JSON.stringify({
          message,
          sessionId,
          username,
          ...overrides,
        }),
        signal: ctrl.signal,
        openWhenHidden: true,
        async onopen(response) {
          if (response.ok) {
            return; // everything's good
          } else if (response.status >= 400) {
            await response
              .json()
              .then((serverResponse) => {
                handleChat(serverResponse);
              })
              .catch(() => {
                handleChat({
                  id: v4(),
                  type: "abort",
                  textResponse: null,
                  sources: [],
                  close: true,
                  error: `An error occurred while streaming response. Code ${response.status}`,
                });
              });
            ctrl.abort();
            throw new Error();
          } else {
            handleChat({
              id: v4(),
              type: "abort",
              textResponse: null,
              sources: [],
              close: true,
              error: `An error occurred while streaming response. Unknown Error.`,
            });
            ctrl.abort();
            throw new Error("Unknown Error");
          }
        },
        async onmessage(msg) {
          try {
            const chatResult = JSON.parse(msg.data);
            handleChat(chatResult);
          } catch {}
        },
        onerror(err) {
          handleChat({
            id: v4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: `An error occurred while streaming response. ${err.message}`,
          });
          ctrl.abort();
          throw new Error();
        },
      });
    } catch (e) {
      console.error("Error streaming chat:", e);
      handleChat({
        id: v4(),
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error: `Connection error: Please check your network connection and try again.`,
      });
    }
  },
};

export default ChatService;
