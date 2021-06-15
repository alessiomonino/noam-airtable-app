import React, { useEffect, useState } from "react";

import { RecordCard, Button, Heading, Box } from "@airtable/blocks/ui";

import RecordsList from "./RecordsList";
import { blockBtnStyles, recordStyles } from "../styles";

const RecordsForm = ({
  recordPicked,
  tablePicked,
  onChangeRecordPicked,
  onChangeParams,
  onSend,
  isLoading,
}) => {
  const [recordsInTable, setRecordsInTable] = useState(null);

  useEffect(() => {
    const queryResult = tablePicked ? tablePicked.selectRecords() : null;
    if (queryResult) {
      setRecordsInTable(queryResult);
    }
  }, [tablePicked]);

  return (
    <>
      {recordPicked ? (
        <>
          <Heading variant="caps" marginBottom="20px">
            You chose the record:
          </Heading>
          <Button
            size="small"
            icon="edit"
            marginBottom="5px"
            onClick={() => onChangeRecordPicked(null)}
          >
            Choose another record
          </Button>
          <Box
            height="auto"
            padding="20px 10px"
            border="thick"
            backgroundColor="lightGray1"
            marginBottom="20px"
          >
            <RecordCard
              record={recordPicked}
              onClick={() => null}
              marginBottom="20px"
              style={recordStyles}
            />
          </Box>
          <Button
            type="submit"
            disabled={!recordPicked || isLoading}
            style={blockBtnStyles}
            variant="primary"
            onClick={onSend}
            width="30%"
          >
            {isLoading ? "Sending" : "Send the record"}
          </Button>
        </>
      ) : (
        <>
          <Heading variant="caps" marginBottom="20px">
            Please choose the record:
          </Heading>
          <Button
            size="small"
            icon="edit"
            marginBottom="5px"
            onClick={onChangeParams}
          >
            Change Table or Url
          </Button>
          <RecordsList
            queryResult={recordsInTable}
            onRecordClick={onChangeRecordPicked}
          />
        </>
      )}
    </>
  );
};

export default RecordsForm;
