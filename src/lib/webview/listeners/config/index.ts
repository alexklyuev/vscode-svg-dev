import { ConfigListener } from "./config.listener";
import { configPipe } from "@/shared/pipes/config.pipe";
import { appearance } from "@/webview/services/appearance";


export const configListener = new ConfigListener(configPipe, appearance);
configListener.listen();
