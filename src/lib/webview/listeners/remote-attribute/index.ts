import { RemoteAttributeListener } from "./remote-attribute.listener";
import { remoteAttributePipe } from "@/shared/pipes/remote-attribute.pipe";
import { holder } from "@/webview/services/holder";


export const remoteAttributeListener = new RemoteAttributeListener(remoteAttributePipe, holder);
// remoteAttributeListener.listen();
