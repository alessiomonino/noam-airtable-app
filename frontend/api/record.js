const getOptions = (record) => ({
  method: "POST",
  body: JSON.stringify(record),
});

export const sendRecord = async (url, record) => {
  try {
    const res = await fetch(url, getOptions(record));

    if (!res.ok) {
      const { error } = await res.json();

      throw error;
    }
    console.log(`✅ The record * ${record["name"]} * was succesfully sent.`);
    console.log(record);

    return true;
  } catch (e) {
    console.log(`❌ Error sending * ${JSON.stringify(record)}`);
    console.log(e);
    throw e;
  }
};
