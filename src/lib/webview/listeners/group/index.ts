import { GroupListener } from "./group.listener";
import { groupPipe } from "@/shared/pipes/group.pipe";
import { holder } from "@/webview/services/holder";


export const groupListener = new GroupListener(groupPipe, holder);
groupListener.listen();
