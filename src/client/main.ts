import { findMethodIterator } from '@/common/iterators';
import { appearance } from '@/webview/services/appearance';
import { editPointsHub } from '@/webview/services/edit-points-hub';
import { webviewEndpoint } from '@/webview/services/webview-endpoint';

import { zoomPipe } from '../shared/pipes/zoom.pipe';
import { remoteAttributePipe } from '../shared/pipes/remote-attribute.pipe';
import { createPipe } from '../shared/pipes/create.pipe';
import { editPipe } from '../shared/pipes/edit.pipe';
import { flushPipe } from '../shared/pipes/flush.pipe';
import { artboard, artboardMove } from './src/services/artboard';
import { RemoteAttributeListener } from './src/listeners/remote-attribute.listener';
import { CreateListener } from './src/listeners/create.listener';
import { FlushListener } from './src/listeners/flush.listener';
import { ZoomListener } from './src/listeners/zoom.listener';
import { ArrangeListener } from './src/listeners/arrange.listener';
import { arrangePipe } from '../shared/pipes/arrange.pipe';
import { elementPipe } from '../shared/pipes/element.pipe';
import { pickPipe } from '../shared/pipes/pick.pipe';
import { groupPipe } from '../shared/pipes/group.pipe';
import { ElementListener } from './src/listeners/element.listener';
import { holder, picker } from './src/services/picker';
import { zoom } from './src/services/zoom';
import { figuresCollection } from './src/figures';
import { GroupListener } from './src/listeners/group.listener';
import { cancelListener, artboardListener, artboardStyleListener } from './src/listeners';
import { guides } from './src/services/guides';
import { EditListener } from './src/listeners/edit.listener';
import {
    shapesOutlet,
    editPointsControl,
    groupControls,
    fillControl,
    strokeControl,
    artboardControls,
} from './src/services/hud';
import { AppearanceResponse } from '../shared/pipes/appearance.pipe';
import { inverseInteractiveEndpoint } from './src/producers/inverse-interactive.producer';
import { MoveKeyListener } from './src/listeners/move-key.listener';
import { moveKeyPipe } from '../shared/pipes/move-key.pipe';
import { ListAttributesListener } from './src/listeners/list-attributes.listener';
import { listAttributesPipe } from '../shared/pipes/list-attributes.pipe';
import { infomessageEndpoint } from './src/producers/infomessage.producer';
import { hints } from './src/services/hints';
import { UndoListener } from './src/listeners/undo.listener';
import { undoPipe } from '../shared/pipes/undo.pipe';
import { ConfigListener } from './src/listeners/config.listener';
import { configPipe } from '../shared/pipes/config.pipe';


/**
 * 
 */
guides.createContainer();

/**
 * 
 */
artboardMove.on();


const pickEndpoint = webviewEndpoint.createFromPipe(pickPipe);


/**
 * draw tools svg and selection on artboard move
 */
(async () => {
    const artboardMoveMouseMove = findMethodIterator(artboardMove.onMouseMove);
    for await ( const _event of artboardMoveMouseMove ) {
        guides.setContainerStyles();
        guides.setSelectionStyles(holder.elements);
    }
})();

/**
 * update selection drawing on move selected element(s)
 */
(async () => {
    const pickerMouseMove = findMethodIterator(picker.onMousemove);
    for await ( const _event of pickerMouseMove ) {
        guides.setSelectionStyles(holder.elements);
    }
})();

/**
 * on zoom value changes
 */
(async () => {
    const zoomValues = findMethodIterator(zoom.update);
    for await ( const value of zoomValues ) {
        pickEndpoint.makeSetRequest({ html: `zoom: ${ Math.round(value * 100) }%` });
        guides.setContainerStyles();
        guides.setSelectionStyles(holder.elements);
    }
})();

/**
 * 
 */
picker.listen();

/**
 * 
 */
const zoomListener = new ZoomListener(zoomPipe, artboard, zoom);
zoomListener.listen();

/**
 * draw artboard styles on artboard attributes changes
 */
(async () => {
    const artboardPropertyChanges = findMethodIterator(artboardListener.updateAttributes);
    for await (const _pair of artboardPropertyChanges) {
        guides.setContainerStyles();
    }
})();

/**
 * Webview artboard style pipe client
 */
// const artboardStyleListener = new ArtboardStyleListener(webviewEndpoint, artboardStylePipe, artboard, new CssJsNotationConverter());
artboardStyleListener.listen();

/**
 * 
 */
const remoteAttributeListener = new RemoteAttributeListener(remoteAttributePipe, holder);
remoteAttributeListener.listen();

/**
 * 
 */
const createListener = new CreateListener(createPipe, figuresCollection);
createListener.listen();

/**
 * 
 */
const editListener = new EditListener(editPipe, figuresCollection, holder);
editListener.listen();

/**
 * 
 */
const flushListener = new FlushListener(flushPipe, artboard);
flushListener.listen();

/**
 * 
 */
const arrangeListener = new ArrangeListener(arrangePipe, artboard, holder);
arrangeListener.listen();

/**
 * 
 */
const elementListener = new ElementListener(elementPipe, holder, figuresCollection);
elementListener.listen();

/**
 * 
 */
const groupListener = new GroupListener(groupPipe, holder, artboard);
groupListener.listen();

/**
 * 
 */
cancelListener.listen();

/**
 * 
 */
const moveKeyListener = new MoveKeyListener(moveKeyPipe, holder, figuresCollection);
moveKeyListener.listen();

/**
 * rebuild guides and remove editing mode on arrow key events
 */
(async () => {
    const keys = findMethodIterator(moveKeyListener.fireMoveEvent);
    for await (const _key of keys) {
        editPointsHub.purge();
        guides.setContainerStyles();
        guides.setSelectionStyles(holder.elements);
    }
})();

/**
 * send message to host on element(s) selection
 */
(async () => {
    const elementsHasBeenSet = findMethodIterator(holder.elementsHasBeenSet);
    for await (const elements of elementsHasBeenSet) {
        setTimeout(() => {
            if (elements.length > 0) {
                pickEndpoint.makeSetRequest({
                    html: `selection: [${elements.map(el => [el.nodeName, el.id].filter(str => str).join('#')).join(', ')}]`
                });
                guides.removeSelection();
                guides.drawSelection(elements);
            } else {
                pickEndpoint.makeSetRequest({html: null});
                guides.removeSelection();
            }
        }, 0);
    }
})();

/**
 * change appearance on element(s) selection
 */
(async () => {
    const elementsHasBeenSet = findMethodIterator(holder.elementsHasBeenSet);
    for await (const elements of elementsHasBeenSet) {
        if (elements.length > 0) {
            const lastElement = elements[elements.length - 1];
            const fill = lastElement.getAttribute('fill');
            const stroke = lastElement.getAttribute('stroke');
            if (fill) {
                appearance.fill = fill;
                fillControl.updateFillBtn(fill);
            }
            if (stroke) {
                appearance.stroke = stroke;
                strokeControl.updateStrokeBtn(stroke);
            }
        }
    }
})();

/**
 * show/hide edit button
 */
(async () => {
    const elementsHasBeenSet = findMethodIterator(holder.elementsHasBeenSet);
    for await (const elements of elementsHasBeenSet) {
        if (elements.length > 0) {
            const element = elements[0];
            const delegate = figuresCollection.delegate(element);
            if (delegate && delegate.edit instanceof Function) {
                editPointsControl.show();
            } else {
                editPointsControl.hide();
            }
        } else {
            editPointsControl.hide();
        }
    }
})();

/**
 * edit on pick
 */
(async () => {
    const pickerMouseUps = findMethodIterator(picker.onMouseup);
    for await (const _event of pickerMouseUps) {
        editPointsHub.startEditing(holder.elements[0]);
    }
})();

/**
 * //
 */
const appearanceRequestCallback = async (response: Promise<AppearanceResponse>) => {
    const { name, value } = await response;
    holder.elements.forEach(el => {
        el.setAttribute(name, value);
    });
};
(async () => {
    const requests = findMethodIterator(fillControl.makeAppearanceGetRequest);
    for await (const request of requests) {
        appearanceRequestCallback(request);
    }
})();
(async () => {
    const requests = findMethodIterator(strokeControl.makeAppearanceGetRequest);
    for await (const request of requests) {
        appearanceRequestCallback(request);
    }
})();

/**
 * Create elements by hud shape tools
 */
(async () => {
    const creates = findMethodIterator(shapesOutlet.createShape);
    for await (const shapeName of creates) {
        inverseInteractiveEndpoint.makeSetRequest({});
        figuresCollection.delegate(shapeName)! .create(shapeName, {});
    }
})();

/**
 * group/ungroup selected elements by button
 */
(async () => {
    const group = findMethodIterator(groupControls.fireGroupEvent);
    for await (const _event of group) {
        groupListener.group();
    }
})();
(async () => {
    const ungroup = findMethodIterator(groupControls.fireUngroupEvent);
    for await (const _event of ungroup) {
        groupListener.ungroup();
    }
})();

/**
 * rebuild container and selection on element copy
 */
(async () => {
    const copyElement = findMethodIterator(elementListener.copyInPlaceElement);
    for await (const _element of copyElement) {
        setTimeout(() => {
            guides.setContainerStyles();
            guides.setSelectionStyles(holder.elements);
        }, 0);
    }
})();

/**
 * edit on copy
 */
(async () => {
    const copyElement = findMethodIterator(elementListener.copyInPlaceElement);
    for await (const _element of copyElement) {
        editPointsHub.startEditing(holder.elements[0]);
    }
})();

/**
 * remove editing on delete
 */
(async () => {
    const deleteElement = findMethodIterator(elementListener.deleteElement);
    for await (const _void of deleteElement) {
        editPointsHub.takeActiveElement(null);
        editPointsHub.takeCancelationFn(() => {});
    }
})();

const listAttributesListener = new ListAttributesListener(listAttributesPipe, holder);
listAttributesListener.listen();

/**
 * send request to host to show info message on hint
 */
(async () => {
    const hintEvents = findMethodIterator(hints.fireHintEvent);
    for await (const hintKey of hintEvents) {
        infomessageEndpoint.makeSetRequest(hintKey);
    }
})();

const undoListener = new UndoListener(undoPipe, artboard, holder);
undoListener.listen();

/**
 * draw guides and set artboard controls on undo/redo
 */
(async () => {
    const renders = findMethodIterator(undoListener.renderState);
    for await (const _state of renders) {
        guides.setContainerStyles();
        guides.setSelectionStyles(holder.elements);
        artboardControls.updateArtboardWidth(artboard.width);
        artboardControls.updateArtboardHeight(artboard.height);
    }
})();

const configListener = new ConfigListener(configPipe, appearance);
configListener.listen();

/**
 * Stream of clicks on 'edit point' button inside editing window
 */
(async () => {
    const clicks = findMethodIterator(editPointsControl.editPoints);
    for await ( const _event of clicks ) {
        inverseInteractiveEndpoint.makeSetRequest({});
        editPointsHub.startEditing(holder.elements[0]);
    }
})();
