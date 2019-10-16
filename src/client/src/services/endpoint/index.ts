import { host } from "@/webview/services/host-api/index";
import { WebviewEndpoint } from "./webview-endpoint";

export const webviewEndpoint = new WebviewEndpoint(host);
