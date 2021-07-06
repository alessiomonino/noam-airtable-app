const NOTIFY_OWNER_URL =
  "https://hooks.zapier.com/hooks/catch/6204614/o610tej/";
// "https://hooks.zapier.com/hooks/catch/1156542/b39k94b/";
// here you paste the link to the webhook, where you want the notifications to come

const getOptions = (body) => ({
  method: "POST",
  body: JSON.stringify(body),
});

//send record
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

export const notifyAppOwner = async ({ base, session, table, record }) => {
  try {
    const notificationBody = {
      baseId: base.id,
      tableId: table.id,
      recordId: record.id,
      userEmail: session.currentUser.email,
      date: Date.now(),
      dateTimeStamp: new Date().toString(),
    };

    const res = await fetch(NOTIFY_OWNER_URL, getOptions(notificationBody));

    if (!res.ok) {
      const { error } = await res.json();

      throw error;
    }
    console.log("Info sent succesfully", notificationBody);
  } catch (e) {
    console.error("Error while notyfying the owner", e.message);
  }
};
