import React from "react";

import { Heading, Button, Box } from "@airtable/blocks/ui";

const ResultMessage = ({ error, onRetry, record }) => {
  return (
    <>
      {error ? (
        <>
          <Heading variant="caps" size="xlarge">
            Unfortunately your record was not sent, please try again!
          </Heading>
          <Box marginBottom="20px">
            <Heading size="xsmall" textColor="light">
              Error: {error.message}
            </Heading>
          </Box>
          <Button onClick={() => onRetry()} variant="primary" icon="redo">
            Try again
          </Button>
        </>
      ) : (
        <>
          <Heading variant="caps" size="small">
            Your record:
            {record &&
              JSON.stringify({ name: record.name, id: record.id })}{" "}
            send successfully!
          </Heading>
          <Button onClick={() => onRetry()} variant="primary" icon="redo">
            Send another record
          </Button>
        </>
      )}
    </>
  );
};

export default ResultMessage;
