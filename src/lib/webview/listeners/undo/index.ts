import { UndoListener } from "./undo.listener";
import { undoPipe } from "@/shared/pipes/undo.pipe";
import { holder } from "@/webview/services/holder";


export const undoListener = new UndoListener(undoPipe, holder);
undoListener.listen();
