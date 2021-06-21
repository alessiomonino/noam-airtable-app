import {
  useBase,
  useGlobalConfig,
  useRecordActionData,
  useRecordById,
} from "@airtable/blocks/ui";

//useBlock is used to access all the variables in the base. globalConfig with url is not stored locally in app but in the Airtable logic. Extrapolated from hook
const useBlock = () => {
  // ------ Configure base -------------------------
  const base = useBase();
  // -----------------------------------------------

  // ------ Configure config methods -------------------------
  //used for url
  const globalConfig = useGlobalConfig();

  //------- Configure ActionData if exists ---------
  // used to get automatically get info about the record if they are run from the button and not by just running app
  const recordActionData = useRecordActionData();
  // -----------------------------------------------

  //------- Configure Table if exists --------------
  //if we have recordActionData from this we automatically get table, record id etc. Inline if, if recordActionData exists so you activated through button you get all info autoamtically or else you have to add it in and it starts as null
  const table = recordActionData
    ? base.getTableByIdIfExists(recordActionData.tableId)
    : null;
  // ----------------------------------------------

  //------- Configure Record if exists ------------
  //like above but with record id
  const recordId = recordActionData ? recordActionData.recordId : "";
  const record = useRecordById(table, recordId);
  // ----------------------------------------------

  return { base, table, record, globalConfig };
};

export default useBlock;
