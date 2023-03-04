import "module-alias/register";

import { DatabaseConnector } from "@database";

const main = async () => {
    const connection = await new DatabaseConnector().createConnection();
    if (connection) return;
}

main()