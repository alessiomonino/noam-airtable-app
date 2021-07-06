//we are importing react. useEffect is used when you change url or table.
import React, { useEffect, useState, useCallback } from "react";

// this is internal Airtable logic, it renders the application
import { Loader } from "@airtable/blocks/ui";

//used to get all info from Airtable parameters
import useBlock from "./hoooks/useBlock";

//custom loader. Styles are just Airtable objects, since Airtable does not support custom css
import { loaderStyles, rootStyles } from "./styles";

import { notifyAppOwner, sendRecord } from "./api/record";

//import react components
import RecordsForm from "./components/RecordsForm";
import ConfigureForm from "./components/ConfigureForm";
import ResultMessage from "./components/ResultMessage";
import Logo from "./components/Logo";
import Limit from "./components/Limit";
import Counter from "./components/Counter";

function SendToWebhook() {
  const { base, table, record, globalConfig, session } = useBlock();

  //create state for url. Like global state of application. So we are storing all variables above (table, record, url) in here
  const [url, setUrl] = useState("");

  // if the globalConfig has an url key, set State's url to it's value
  //useEffect used to get the url from globalConfig
  useEffect(() => {
    const getUrlFromConfig = async () => {
      const urlFromConfig = await globalConfig.get("url");
      if (urlFromConfig) setUrl(urlFromConfig.trim());
    };

    getUrlFromConfig();
  }, [globalConfig]);

  // on every url change update globalConfig accordingly
  //useEffect used to write the url to globalConfig every time url changes
  useEffect(() => {
    if (url.trim()) globalConfig.setAsync("url", url);
  }, [url, globalConfig]);

  const [tablePicked, setTablePicked] = useState(null);

  // if table recieved from useBlock, set State's table to it's value
  //create state for table. If received from clicking button automatic, or else picked manually
  useEffect(() => {
    if (table) setTablePicked(table);
  }, [table]);

  // initiate global record param
  //same as table above
  const [recordPicked, setRecordPicked] = useState(null);

  // if record recieved from useBlock (button), set State's record to it's value
  useEffect(() => {
    if (record) setRecordPicked(record);
  }, [record]);

  /* if the table changed during use of app, set the record to null, 
  so it could be selected step further */
  //if you change the table you have to choose record/table once again. The eisting ones are set to null
  useEffect(() => {
    if (table && tablePicked) {
      setRecordPicked((prevRecord) => (record !== prevRecord ? null : record));
    }
  }, [table, tablePicked, record]);

  // the sum of the requests made by user
  const [requestsNumber, setRequestsNumber] = useState(98);

  useEffect(() => {
    // recieve the number of requests made from globalConfig
    const getRequestsNumberFromConfig = async () => {
      const configRequestsNumber = await globalConfig.get("requestsNumber");
      if (configRequestsNumber) setRequestsNumber(configRequestsNumber);
    };
    getRequestsNumberFromConfig();
  }, [globalConfig]);

  // on every requestsNumber write the value to globalConfig

  useEffect(() => {
    globalConfig.setAsync("requestsNumber", requestsNumber);
  }, [requestsNumber, globalConfig]);

  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const getIsPremiumFromConfig = async () => {
      const isPremiumFromConfig = await globalConfig.get("premium");
      if (isPremiumFromConfig) setIsPremium(isPremiumFromConfig);
    };
    getIsPremiumFromConfig();
  }, [globalConfig]);

  // state value responsible for RecordsForm appearance
  //if true you have to choose record manually
  const [isShowRecordsForm, setIsShowRecordsForm] = useState(false);

  // state value showing whether the application has sent the request
  //if request has been processed, could be error or success
  const [isRequestProcessed, setIsRequestProcessed] = useState(false);

  //if error gives error
  const [error, setError] = useState(null);

  //if loading disables send to not click twice while request sending
  const [isLoading, setIsLoading] = useState(false);

  //function wrapped to use callback to avoid rendering too many times. This is used when record is chosen from button
  const handleSendRecord = useCallback(
    async (urlParam, tableParam) => {
      setIsLoading(true);

      // the url and table could be passed via params, or taken from app's state
      //url and table used to process the request
      const fetchUrl = urlParam || url;
      const fetchTable = tableParam || tablePicked;

      if (!fetchUrl || !fetchTable) {
        // if no url or table were selected send app in the error status
        const errorInfo = !fetchTable
          ? "Table not selected"
          : "URL not selected";

        //if stuff was not selected you get error
        setError({ message: errorInfo });
        setIsRequestProcessed(true);
        setIsLoading(false);
        return;
      }

      //if record was not picked but you sent, it tells you to select a record
      if (!recordPicked) {
        // if no record selected the app switches to record's selector
        setIsShowRecordsForm(true);
        setIsLoading(false);
        return;
      }

      //tries to send record
      try {
        await sendRecord(fetchUrl, {
          id: recordPicked.id,
          name: recordPicked.name,
        });
        setRequestsNumber((prevNumber) => prevNumber + 1);
        notifyAppOwner({
          base,
          table: tablePicked,
          record: recordPicked,
          session,
        });
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
        setIsRequestProcessed(true);
      }
    },
    [recordPicked, url, tablePicked, base, session]
  );

  // on each change of recordPicked try to send the request
  // needed for automatic request, if app ran from button, everytime record is picked it tries to send record
  useEffect(() => {
    if (recordPicked) {
      handleSendRecord();
    }
  }, [recordPicked, handleSendRecord]);

  //function that allows you to choose the record. If error you can rechoose url/table
  const handleRetry = () => {
    // on every retry take app before request process
    setIsRequestProcessed(false);
    setRecordPicked(null);

    // in case of error take app back to configuring params
    if (error) {
      setIsShowRecordsForm(false);
      setError(null);
      return;
    }
    // if no record, show records list
    setIsShowRecordsForm(true);
  };

  // send app to the point where table/url can be changed
  //you can still change url after you already selected record
  const handleChangeParams = () => {
    setIsShowRecordsForm(false);
  };

  //if application is loading just shows loader
  if (isLoading)
    return (
      <Loader
        scale={0.3}
        position="absolute"
        top="50%"
        left="50%"
        style={loaderStyles}
      />
    );

  //what is rendered
  return (
    <div style={rootStyles}>
      {/* if the number of requests made are higher, than 100, and user has not premium account show the Limit component */}
      {requestsNumber > 99 && !isPremium ? (
        <Limit onUpgrade={setIsPremium} />
      ) : (
        <>
          {!isRequestProcessed ? (
            <>
              {/* if you have not chosen table or url you go to configure form */}
              {!isShowRecordsForm ? (
                <ConfigureForm
                  handleSend={handleSendRecord}
                  isLoading={isLoading}
                  tableParam={tablePicked}
                  handleTableChange={setTablePicked}
                  urlParam={url}
                  handleUrlChange={setUrl}
                />
              ) : (
                <RecordsForm
                  handleSend={handleSendRecord}
                  isLoading={isLoading}
                  onChangeRecordPicked={setRecordPicked}
                  tablePicked={tablePicked}
                  onChangeParams={handleChangeParams}
                />
              )}
            </>
          ) : (
            // if request processed you receive result message
            <ResultMessage
              record={recordPicked}
              error={error}
              isLoading={isLoading}
              onRetry={handleRetry}
            />
          )}
        </>
      )}
      {/* if request was not processed it shows either configure or record form */}
      {!isPremium && <Counter count={requestsNumber} />}
      <Logo />
    </div>
  );
}

export default SendToWebhook;
