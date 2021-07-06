//this is just list of records used in RecordsForm.js
import { useRecords, Box, RecordCardList } from "@airtable/blocks/ui";
import React from "react";

const RecordsList = ({ queryResult, onRecordClick }) => {
  const records = useRecords(queryResult);

  return (
    <>
      {records && (
        <Box
          height="60vh"
          border="thick"
          backgroundColor="lightGray1"
          marginBottom="20px"
        >
          <RecordCardList records={records} onRecordClick={onRecordClick} />
        </Box>
      )}
    </>
  );
};

export default RecordsList;
