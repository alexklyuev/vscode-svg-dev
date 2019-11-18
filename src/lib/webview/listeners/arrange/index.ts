import { ArrangeListener } from "./arrange.listener";
import { arrangePipe } from "@/shared/pipes/arrange.pipe";
import { holder } from "@/webview/services/holder";


export const arrangeListener = new ArrangeListener(arrangePipe, holder);
arrangeListener.listen();
