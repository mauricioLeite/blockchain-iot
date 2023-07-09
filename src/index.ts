import "module-alias/register";
import { BrokerClient, Server } from "./server";

new Server().listen(); 

new BrokerClient();