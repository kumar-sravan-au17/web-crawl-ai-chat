import React from "react";
import "./Input.css";

const Input = ({ handleMessageChange, inputMessage, handleSend }) => {
  return (
    <form className="input-container" onSubmit={handleSend}>
      <input
        type="text"
        placeholder="Write a message..."
        value={inputMessage}
        onChange={handleMessageChange}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default Input;
