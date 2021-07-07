import React from "react";
import { logoStyles } from "../styles";

const Logo = () => {
  return (
    <div style={logoStyles}>
      <img
        // here you can change the width and width and the height(values in pixels)
        width="32"
        height="32"
        // below you are able to pass the url to logo
        src="https://res.cloudinary.com/noamsay/image/upload/v1625678672/favicon-noamsay.png"
        alt="App Logo"
      />
    </div>
  );
};

export default Logo;
