import React from "react";
import {
  Button,
  Input,
  Label,
  TablePicker,
  Icon,
  Text,
} from "@airtable/blocks/ui";

import { blockBtnStyles } from "../styles";

const ConfigureForm = ({
  tablePicked,
  onSend,
  onChangeTable,
  url,
  configUrl,
  onUrlChange,
  isLoading,
}) => {
  const isShowUrlInputField = configUrl && url === null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSend();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {isShowUrlInputField ? (
          <>
            <Label display="block">URL</Label>
            <div style={{ marginBottom: "20px", display: "flex" }}>
              <Icon
                name="edit"
                marginRight="5px"
                onClick={() => onUrlChange("")}
              />
              <Text id="url">{configUrl}</Text>
            </div>
          </>
        ) : (
          <>
            <Label htmlFor="url" display="block">
              Enter the url
            </Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              marginBottom="20px"
              maxWidth="300px"
              required
            />
          </>
        )}

        <Label htmlFor="table" display="block">
          Choose the table
        </Label>
        <TablePicker
          id="table"
          table={tablePicked}
          onChange={(newTable) => onChangeTable(newTable)}
          marginBottom="30px"
          maxWidth="300px"
          required
        />

        <Button
          type="submit"
          style={blockBtnStyles}
          variant="primary"
          width="30%"
          marginBottom="20px"
          disabled={isLoading}
        >
          {isLoading ? "Sending" : "Send the record"}
        </Button>
      </form>
    </>
  );
};

export default ConfigureForm;
