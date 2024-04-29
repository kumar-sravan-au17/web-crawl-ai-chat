import React, { useState } from "react";
import "./Layout.css";
import Dropdown from "../Dropdown/Dropdown";
import Chat from "../Chat/Chat";

const Layout = () => {
  const defaultOptions = [
    {
      name: "Google",
      url: "https://www.google.com",
    },
    {
      name: "Example",
      url: "https://www.example.com",
    },
    {
      name: "Zethic",
      url: "https://www.zethic.com",
    },
    {
      name: "Ollivere",
      url: "https://ollivere.co/",
    },
    {
      name: "Ink",
      url: "https://www.weareink.co.uk/",
    },
    {
      name: "Gloutir",
      url: "https://gloutir.com/",
    },
  ];
  const [selected, setSelected] = useState("");
  const [options, setOptions] = useState(defaultOptions);
  const handleSelect = (e) => {
    console.log(e.target.value);
    setSelected(e.target.value);
  };
  return (
    <div className="layout">
      <div className="layout-main">
        <Dropdown options={options} handleSelect={handleSelect} />
        <Chat selected={selected} />
      </div>
    </div>
  );
};

export default Layout;
