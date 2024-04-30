import React, { createRef, useEffect, useState } from "react";
import axios from "axios";
import "./Chat.css";
import "react-toastify/dist/ReactToastify.min.css";
import Input from "../Input/Input";
import AISvg from "../../assets/AI";
import UserSvg from "../../assets/User";
import { Slide, ToastContainer, toast } from "react-toastify";

const Chat = ({ selected }) => {
  // Ref for scrolling to the end of messages
  const endOfMessages = createRef();

  // Initial sample messages
  const sampleMessages = [
    {
      role: "bot",
      message: "Hello, you can ask me questions about the selected website",
    },
  ];

  // State for input message and chat messages
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState(sampleMessages);
  const [loading, setLoading] = useState(false);

  // Handle input message change
  const handleMessageChange = (e) => {
    setInputMessage(e.target.value);
  };

  // Handle sending user message
  const handleSend = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    // Add user message to state
    const currentMessage = {
      role: "user",
      message: inputMessage,
    };
    setMessages((state) => [...state, currentMessage]);
    setInputMessage("");
    setLoading(true);
    try {
      // Make API call to AI server
      const URL = import.meta.env.VITE_SERVER_URL + "/ai-chat";
      const response = await axios.post(URL, {
        url: selected,
        question: inputMessage,
      });

      // Add bot response to state
      const botMessage = {
        role: "bot",
        message: response.data,
      };
      setMessages((state) => [...state, botMessage]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      notify("error", "Something went wrong!");
      setLoading(false);
    }
  };

  // To notify of any alerts
  const notify = (type, message) => {
    switch (type) {
      case "error":
        toast.error(message);
        break;
      case "warn":
        toast.warn(message);
        break;
      default:
        toast.info(message);
        break;
    }
  };

  // Scroll to end of messages when new messages are added
  useEffect(() => {
    if (messages.length > 4) {
      endOfMessages.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
      <div className="messages">
        {/* Display selected website */}
        <p className="help-text">
          {selected ? `Selected website : ${selected}` : ""}
        </p>

        {/* Render chat messages */}
        {messages.map((item, idx) => (
          <div className="message-item" key={idx}>
            <div className="icon">
              {item.role === "bot" ? <AISvg /> : <UserSvg />}
            </div>
            <div className="message-body">
              <h5>{item.role === "bot" ? "AI" : "You"}</h5>
              <p>{item.message}</p>
            </div>
          </div>
        ))}

        {/* Show loading indicator */}
        {loading ? (
          <>
            <div className="loader-dots"></div>
          </>
        ) : (
          ""
        )}
      </div>

      {/* Input component for user messages */}
      <Input
        inputMessage={inputMessage}
        handleMessageChange={handleMessageChange}
        handleSend={handleSend}
      />
      {/* Dummy div just to scroll into view after adding new message */}
      <div ref={endOfMessages}></div>
    </div>
  );
};

export default Chat;
