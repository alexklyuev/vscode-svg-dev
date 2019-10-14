import { zoomPipe } from '../shared/pipes/zoom.pipe';
import { remoteAttributePipe } from '../shared/pipes/remote-attribute.pipe';
import { createPipe } from '../shared/pipes/create.pipe';
import { editPipe } from '../shared/pipes/edit.pipe';
import { flushPipe } from '../shared/pipes/flush.pipe';
import { artboard, artboardMove } from './src/services/artboard';
import { webviewEndpoint } from './src/services/endpoint';
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
import { appearance } from './src/services/appearance';
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

import { editPointsHub } from '@/webview/services/edit-points-hub';
import { findMethodIterator } from '@/common/iterators';

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
const zoomListener = new ZoomListener(webviewEndpoint, zoomPipe, artboard, zoom);
zoomListener.listen();

/**
 * 
 */
artboardListener.listen();
artboardListener.changeProperty.on(() => {
    guides.setContainerStyles();
});

/**
 * Webview artboard style pipe client
 */
// const artboardStyleListener = new ArtboardStyleListener(webviewEndpoint, artboardStylePipe, artboard, new CssJsNotationConverter());
artboardStyleListener.listen();

/**
 * 
 */
const remoteAttributeListener = new RemoteAttributeListener(webviewEndpoint, remoteAttributePipe, holder);
remoteAttributeListener.listen();

/**
 * 
 */
const createListener = new CreateListener(webviewEndpoint, createPipe, figuresCollection);
createListener.listen();

/**
 * 
 */
const editListener = new EditListener(webviewEndpoint, editPipe, figuresCollection, holder, editPointsHub);
editListener.listen();

/**
 * 
 */
const flushListener = new FlushListener(webviewEndpoint, flushPipe, artboard);
flushListener.listen();

/**
 * 
 */
const arrangeListener = new ArrangeListener(webviewEndpoint, arrangePipe, artboard, holder);
arrangeListener.listen();

/**
 * 
 */
const elementListener = new ElementListener(webviewEndpoint, elementPipe, holder, figuresCollection);
elementListener.listen();

/**
 * 
 */
const groupListener = new GroupListener(webviewEndpoint, groupPipe, holder, artboard);
groupListener.listen();

/**
 * 
 */
cancelListener.listen();

/**
 * 
 */
const moveKeyListener = new MoveKeyListener(webviewEndpoint, moveKeyPipe, holder, figuresCollection);
moveKeyListener.listen();
moveKeyListener.moveEvent.on(_key => {
    guides.setContainerStyles();
    guides.setSelectionStyles(holder.elements);
});

/**
 * 
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
 * 
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
        editListener.editElement();
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
fillControl.appearanceRequest.on(appearanceRequestCallback);
strokeControl.appearanceRequest.on(appearanceRequestCallback);

/**
 * Create elements by hud shape tools
 */
shapesOutlet.createShapeEvent.on(shapeName => {
    inverseInteractiveEndpoint.makeSetRequest({});
    figuresCollection.delegate(shapeName)! .create(shapeName, {});
});

groupControls.groupEvent.on(_event => {
    if (holder.elements.length > 0) {
        groupListener.group();
    }
});

groupControls.ungroupEvent.on(_event => {
    groupListener.ungroup();
});

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
        editListener.editElement();
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

const listAttributesListener = new ListAttributesListener(webviewEndpoint, listAttributesPipe, holder);
listAttributesListener.listen();

hints.hintEvent.on(hintKey => {
    infomessageEndpoint.makeSetRequest(hintKey);
});

const undoListener = new UndoListener(webviewEndpoint, undoPipe, artboard, holder);
undoListener.listen();
undoListener.renderStateEvent.on(_state => {
    guides.setContainerStyles();
    guides.setSelectionStyles(holder.elements);
    artboardControls.updateArtboardWidth(artboard.width);
    artboardControls.updateArtboardHeight(artboard.height);
});

const configListener = new ConfigListener(webviewEndpoint, configPipe, appearance);
configListener.listen();

/**
 * Stream of clicks on 'edit point' button inside editing window
 */
(async () => {
    const clicks = findMethodIterator(editPointsControl.editPoints);
    for await ( const _event of clicks ) {
        inverseInteractiveEndpoint.makeSetRequest({});
        editListener.editElement();
    }
})();
