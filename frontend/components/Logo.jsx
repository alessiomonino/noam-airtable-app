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
        src="https://image.flaticon.com/icons/png/512/2362/2362402.png"
        alt="App Logo"
      />
    </div>
  );
};

export default Logo;
