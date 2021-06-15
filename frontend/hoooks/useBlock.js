import {
  useBase,
  useGlobalConfig,
  useRecordActionData,
  useRecordById,
} from "@airtable/blocks/ui";

const useBlock = () => {
  // ------ Configure base -------------------------
  const base = useBase();
  // -----------------------------------------------

  // ------ Configure config methods -------------------------
  const globalConfig = useGlobalConfig();

  //------- Configure ActionData if exists ---------
  const recordActionData = useRecordActionData();
  // -----------------------------------------------

  //------- Configure Table if exists --------------
  const table = recordActionData
    ? base.getTableByIdIfExists(recordActionData.tableId)
    : null;
  // ----------------------------------------------

  //------- Configure Record if exists ------------
  const recordId = recordActionData ? recordActionData.recordId : "";
  const record = useRecordById(table, recordId);
  // ----------------------------------------------

  return { base, table, record, globalConfig };
};

export default useBlock;
