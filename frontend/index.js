import React, { useEffect, useState, useCallback } from "react";

import { initializeBlock, Loader } from "@airtable/blocks/ui";

import useBlock from "./hoooks/useBlock";

import { rootStyles } from "./styles";
import { sendRecord } from "./api/record";

import RecordsForm from "./components/RecordsForm";
import ConfigureForm from "./components/ConfigureForm";
import ResultMessage from "./components/ResultMessage";

function AirTableApp() {
  const { table, record, globalConfig } = useBlock();

  const [configUrl, setConfigUrl] = useState("");

  const [url, setUrl] = useState(null);

  useEffect(() => {
    const fetchUrlFromConfig = async () => {
      const urlFromConfig = await globalConfig.get("url");
      if (urlFromConfig) setConfigUrl(urlFromConfig);
    };

    fetchUrlFromConfig();
  }, [globalConfig]);

  useEffect(() => {
    if (url) globalConfig.setAsync("url", url);
  }, [url, globalConfig]);

  const [tablePicked, setTablePicked] = useState(null);

  useEffect(() => {
    if (table) setTablePicked(table);
  }, [table]);

  const [recordPicked, setRecordPicked] = useState(null);

  useEffect(() => {
    if (record) setRecordPicked(record);
  }, [record]);

  useEffect(() => {
    if (table && tablePicked && table.id !== tablePicked.id) {
      setRecordPicked(null);
    }
    if (table && tablePicked && record && table.id === tablePicked.id) {
      setRecordPicked((prevRecord) => (record !== prevRecord ? null : record));
    }
  }, [table, tablePicked, record]);

  const [isShowRecordsForm, setIsShowRecordsForm] = useState(false);

  const [isRequestProcessed, setIsRequestProcessed] = useState(false);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendRecord = useCallback(async () => {
    if (
      !recordPicked ||
      (url && !url.trim() && !configUrl.trim()) ||
      !tablePicked
    ) {
      setIsShowRecordsForm(true);
      setIsRequestProcessed(false);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      await sendRecord(url ? url : configUrl, {
        id: recordPicked.id,
        name: recordPicked.name,
      });
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
      setIsRequestProcessed(true);
    }
  }, [recordPicked, url, tablePicked, configUrl]);

  useEffect(() => {
    if (recordPicked) {
      handleSendRecord();
    }
  }, [recordPicked, handleSendRecord]);

  const handleRetry = () => {
    setIsRequestProcessed(false);
    setRecordPicked(null);
    if (error) {
      setIsShowRecordsForm(false);
      setError(null);

      return;
    }

    setIsShowRecordsForm(true);
  };

  const handleChangeParams = () => {
    setIsShowRecordsForm(false);
    setIsRequestProcessed(false);
  };

  if (isLoading)
    return (
      <Loader
        scale={0.3}
        position="absolute"
        top="50%"
        left="50%"
        style={{ transform: "translate(-60%, -60%)" }}
      />
    );

  return (
    <div style={rootStyles}>
      {!isRequestProcessed ? (
        <>
          {!isShowRecordsForm ? (
            <ConfigureForm
              tablePicked={tablePicked}
              onSend={handleSendRecord}
              onChangeTable={setTablePicked}
              url={url}
              configUrl={configUrl}
              onUrlChange={setUrl}
              isLoading={isLoading}
            />
          ) : (
            <RecordsForm
              recordPicked={recordPicked}
              onChangeRecordPicked={setRecordPicked}
              tablePicked={tablePicked}
              onSend={handleSendRecord}
              isLoading={isLoading}
              onChangeParams={handleChangeParams}
            />
          )}
        </>
      ) : (
        <ResultMessage
          error={error}
          onRetry={handleRetry}
          record={recordPicked}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

initializeBlock(() => <AirTableApp />);
