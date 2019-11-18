import { Listener } from "@/webview/models/listener.model";
import { arrangeListener } from './arrange';
import { artboardListener } from './artboard';
import { artboardStyleListener } from './artboard-style';
import { cancelListener } from './cancel';
import { configListener } from './config';
import { createListener } from './create';
import { editListener } from './edit';
import { editModeListener } from './edit-mode';
import { elementListener } from './element';
import { flushListener } from './flush';
import { groupListener } from './group';
import { listAttributesListener } from './list-attributes';
import { moveKeyListener } from './move-key';
import { remoteAttributeListener } from './remote-attribute';
import { undoListener } from './undo';
import { zoomListener } from './zoom';

export const allListeners: {[K: string]: Listener} = {
    arrangeListener,
    artboardListener,
    artboardStyleListener,
    cancelListener,
    configListener,
    createListener,
    editListener,
    editModeListener,
    elementListener,
    flushListener,
    groupListener,
    listAttributesListener,
    moveKeyListener,
    remoteAttributeListener,
    undoListener,
    zoomListener,
};

export const activateAllListeners = () => {
    Object.keys(allListeners)
    .map(key => allListeners[key])
    .forEach(listener => listener.listen());
};

export {
    arrangeListener,
    artboardListener,
    artboardStyleListener,
    cancelListener,
    configListener,
    createListener,
    editListener,
    editModeListener,
    elementListener,
    flushListener,
    groupListener,
    listAttributesListener,
    moveKeyListener,
    remoteAttributeListener,
    undoListener,
    zoomListener,
};
