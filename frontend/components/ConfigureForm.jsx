import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Label,
  TablePicker,
  Icon,
  Text,
} from "@airtable/blocks/ui";

import { blockBtnStyles, iconStyles, urlBlockStyles } from "../styles";

const ConfigureForm = ({
  handleSend,
  tableParam,
  handleTableChange,
  urlParam,
  handleUrlChange,
  isLoading,
}) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (urlParam) setUrl(urlParam);
  }, [urlParam]);

  const [table, setTable] = useState(null);

  useEffect(() => {
    if (tableParam) setTable(tableParam);
  }, [tableParam]);

  const [isShowUrlInput, setIsShowUrlInput] = useState(false);

  useEffect(() => {
    setIsShowUrlInput(urlParam ? false : true);
  }, [urlParam]);

  const handleSubmit = (e) => {
    e.preventDefault();

    handleTableChange && handleTableChange(table);
    handleUrlChange && handleUrlChange(url.trim());

    handleSend(url, table);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {isShowUrlInput ? (
          <>
            <Label htmlFor="url" display="block">
              Enter the Webhook URL
            </Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              marginBottom="20px"
              maxWidth="400px"
              required
            />
          </>
        ) : (
          <>
            <Label display="block">Webhook URL</Label>
            <div style={urlBlockStyles}>
              <Icon
                name="edit"
                marginRight="5px"
                onClick={() => setIsShowUrlInput(true)}
                style={iconStyles}
              />
              <Text id="url">{url}</Text>
            </div>
          </>
        )}

        <Label htmlFor="table" display="block">
          Select the table
        </Label>

        <TablePicker
          id="table"
          table={table}
          onChange={(newTable) => setTable(newTable)}
          marginBottom="30px"
          maxWidth="400px"
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
