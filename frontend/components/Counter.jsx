import { Label } from "@airtable/blocks/ui";
import React from "react";
import { counterStyles, counterStylesSpan } from "../styles";

const Counter = ({ count }) => {
  return (
    <div style={counterStyles}>
      <Label>
        You have made <span style={counterStylesSpan}>{count}</span> out of{" "}
        <span style={counterStylesSpan}>100</span> free requests.
      </Label>
    </div>
  );
};

export default Counter;
