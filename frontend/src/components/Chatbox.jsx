import "../stylesheets/Chatbox.css";

import { useEffect, useRef, useState } from "react";

export default function Chatbox() {
  const draggerRef = useRef(null);
  const chatboxRef = useRef(null);
  const textareaRef = useRef(null);
  const chatInputRef = useRef(null);
  const chatSectionRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      type: "bot-message",
      message: "Hi, I am Pocket AI. How can I help you?",
    },
  ]);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    let draggable = false;
    const dragger = draggerRef.current;
    if (!dragger) return;

    let rect;

    const pointerDown = () => {
      if (!chatboxRef.current) return;

      draggable = true;
      rect = chatboxRef.current.getBoundingClientRect();
      document.body.style.userSelect = "none";
    };
    const pointerMove = (e) => {
      if (draggable && chatboxRef.current) {
        let delta = rect.left - e.clientX;
        let newWidth = Math.max(400, Math.min(900, rect.width + delta));

        chatboxRef.current.style.width = `${newWidth}px`;
      }
    };
    const pointerUp = () => {
      draggable = false;
      document.body.style.userSelect = "";
    };
    dragger.addEventListener("pointerdown", pointerDown);
    document.addEventListener("pointermove", pointerMove);
    document.addEventListener("pointerup", pointerUp);

    return () => {
      dragger.removeEventListener("pointerdown", pointerDown);
      document.removeEventListener("pointermove", pointerMove);
      document.removeEventListener("pointerup", pointerUp);
    };
  }, []);

  useEffect(() => {
    if (chatSectionRef.current) {
      chatSectionRef.current.scrollTop = chatSectionRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="chat-box" ref={chatboxRef}>
        <div className="dragger" ref={draggerRef}></div>
        <div className="chat-container">
          <div className="cross-btn-container">
            <span
              className="cross-btn"
              onClick={() => {
                chatboxRef.current.style.width = "0px";
              }}
            >
              <i className="ti ti-x"></i>
            </span>
            <span className="chat-title">Chat</span>
          </div>
          <div className="chat-section" ref={chatSectionRef}>
            {messages.map((msg, idx) => (
              <div className={msg.type} key="idx">
                {msg.message}
              </div>
            ))}

            <div className="chat-input" ref={chatInputRef}>
              <button className="add-btn" title="Add Pdf">
                <i className="ti ti-plus"></i>
              </button>
              <textarea
                className="input-bar"
                placeholder="Ask Pocket AI.."
                ref={textareaRef}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key == "Enter" && !e.shiftKey) {
                    if(prompt.trim().length <= 0) return
                    e.preventDefault();
                    setMessages((prev) => [
                      ...prev,
                      { type: "user-message", message: prompt.trim() },
                    ]);
                    setPrompt("");
                    chatInputRef.current.style.height = `auto`;
                  }
                }}
                onChange={(e) => {
                  setPrompt(e.target.value);
                }}
                value={prompt}
                onInput={() => {
                  chatInputRef.current.style.height = `auto`;
                  let styles = getComputedStyle(chatInputRef.current);
                  // Added vertical padding as scrollheight of textarea doesnt include padding of chatinput
                  let height =
                    Math.min(textareaRef.current.scrollHeight, 250) +
                    parseFloat(styles.paddingTop) +
                    parseFloat(styles.paddingBottom);
                  chatInputRef.current.style.height = `${height}px`;
                }}
              />
              <button
                className="send-btn"
                title="Send Prompt"
                onClick={() => {
                  if(prompt.trim().length <= 0) return
                  setMessages((prev) => [
                    ...prev,
                    { type: "user-message", message: prompt.trim() },
                  ]);
                  setPrompt("");
                  chatInputRef.current.style.height = `auto`;
                }}
              >
                <i className="ti ti-arrow-up"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="chat-btn"
        title="Chats"
        onClick={() => {
          chatboxRef.current.style.width = "400px";
        }}
      >
        <i className="ti ti-messages"></i>
      </div>
    </>
  );
}
