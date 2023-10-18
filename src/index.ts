import { loadCommands } from "./commands";
import { ServiceLoader } from "./services";

loadCommands();
ServiceLoader.loadServices();
