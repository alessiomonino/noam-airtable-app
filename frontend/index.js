import React from "react";
import { initializeBlock } from "@airtable/blocks/ui";

import SendToWebhook from "./App";

initializeBlock(() => <SendToWebhook />);
