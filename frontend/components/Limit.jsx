import React from "react";
import { Button, Heading } from "@airtable/blocks/ui";

import { limitStyles } from "../styles";

const Limit = ({ onUpgrade }) => {
  return (
    <section style={limitStyles}>
      <Heading variant="caps" size="large">
        You have reached the limit for requests per month!
      </Heading>
      <Button onClick={() => onUpgrade(true)} variant="primary" icon="premium">
        Upgrade to premium
      </Button>
    </section>
  );
};

export default Limit;
