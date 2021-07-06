import React, { useEffect, useState } from "react";

import { RecordCard, Button, Heading, Box } from "@airtable/blocks/ui";

import RecordsList from "./RecordsList";
import { blockBtnStyles, recordStyles } from "../styles";

const RecordsForm = ({
  tablePicked,
  onChangeRecordPicked,
  onChangeParams,
  handleSend,
  isLoading,
}) => {
  const [record, setRecord] = useState(null);

  // on every choice of record update the global record
  //if record picked ok, if not creates a new table you can pisk new record from
  useEffect(() => {
    if (record) onChangeRecordPicked(record);
  }, [record, onChangeRecordPicked]);

  const [recordsInTable, setRecordsInTable] = useState(null);

  // if the table passed and has records, set the records list
  useEffect(() => {
    const queryResult = tablePicked ? tablePicked.selectRecords() : null;
    if (queryResult) {
      setRecordsInTable(queryResult);
    }
  }, [tablePicked]);

  return (
    <>
      {record ? (
        <>
          <Heading variant="caps" marginBottom="20px">
            You chose the record:
          </Heading>
          <Button
            size="small"
            icon="edit"
            marginBottom="5px"
            onClick={() => setRecord(null)}
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
              record={record}
              onClick={() => null}
              marginBottom="20px"
              style={recordStyles}
            />
          </Box>
          <Button
            type="submit"
            disabled={!record || isLoading}
            style={blockBtnStyles}
            variant="primary"
            onClick={() => handleSend()}
            width="30%"
          >
            {isLoading ? "Sending" : "Send the record"}
          </Button>
        </>
      ) : (
        <>
          <Heading variant="caps" marginBottom="20px">
            Please select the record:
          </Heading>
          <Button
            size="small"
            icon="edit"
            marginBottom="5px"
            onClick={onChangeParams}
          >
            Change Table or Url
          </Button>
          <RecordsList queryResult={recordsInTable} onRecordClick={setRecord} />
        </>
      )}
    </>
  );
};

export default RecordsForm;
