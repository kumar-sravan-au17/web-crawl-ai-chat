import React, { useState } from "react";
import "./Dropdown.css";

const Dropdown = ({ options, handleSelect }) => {
  return (
    <div className="dropdown">
      <label htmlFor="website">Select a website from the dropdown</label>
      <select
        name="website"
        id="website"
        defaultValue={""}
        onChange={handleSelect}
      >
        <option value="" disabled>
          Select...
        </option>
        {options.map((item, idx) => (
          <option value={item.url} key={idx}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
