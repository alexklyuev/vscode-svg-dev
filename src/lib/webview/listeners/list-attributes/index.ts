import { ListAttributesListener } from "./list-attributes.listener";
import { listAttributesPipe } from "@/shared/pipes/list-attributes.pipe";
import { holder } from "@/webview/services/holder";


export const listAttributesListener = new ListAttributesListener(listAttributesPipe, holder);
listAttributesListener.listen();
