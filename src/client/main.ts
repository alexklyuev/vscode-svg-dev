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
import { shapesOutlet, editPointsControl, groupControls, fillControl, strokeControl, artboardControls, editOnPick } from './src/services/hud';
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
import { cancelHub } from './src/services/cancel-hub';
import { ConfigListener } from './src/listeners/config.listener';
import { configPipe } from '../shared/pipes/config.pipe';
import { findIterator } from './src/iterators';

// import './playground';


import { fromDomEvent } from '@/dom/iterators';
// import { exposed } from '@/common/iterators';


// const xmerge = (...iters: Array<() => AsyncIterableIterator<any>>) => {
//     let fn = Function();
//     let returnResolve = Function();
//     let returnProm = new Promise(resolve => returnResolve = resolve);
//     const acc = {
//         [Symbol.asyncIterator] () {
//             return {
//                 next () {
//                     return new Promise<{value: any, done: boolean}>(resolve => {
//                         fn = (value: any) => resolve({value, done: false});
//                     });
//                 },
//                 return () {
//                     returnResolve();
//                     const prom = Promise.resolve<{value: Event, done: boolean}>({value: null as any, done: true});
//                     return prom;
//                 },
//             };
//         }
//     };
//     iters.forEach(async iter => {
//         const iterable = iter();
//         returnProm.then(() => {
//             if (iterable.return instanceof Function) {
//                 console.log('iterable.return run');
//                 const rs = iterable.return();
//                 iterable.next();
//                 console.log(rs);
//                 return rs.then(v => console.log(v.done));
//             }
//         });
//         for await (const value of iterable) {
//             console.log(`dvalue ${ value }`);
//             fn(value);
//         }
//     });
//     return async function * () {
//         yield * acc;
//         console.log('end acc');
//     };
// };


(async () => {
    const downs = fromDomEvent(editOnPick.el, 'mousedown');
    for await ( const _down of downs ) {
        console.log('mouse down');
        const ups = fromDomEvent(document, 'mouseup');
        const moves = fromDomEvent(document, 'mousemove');
        (async () => {
            for await ( const _move of moves ) {
                console.log('mouse move');
            }
        })();
        (async () => {
            for await ( const _up of ups ) {
                console.log('mouse up');
                moves.return!();
                ups.return!();
            }
        })();
    }
})();



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
    const artboardMoveMouseMove = findIterator<MouseEvent>(artboardMove.onMouseMove);
    for await ( const _event of artboardMoveMouseMove ) {
        guides.setContainerStyles();
        guides.setSelectionStyles(holder.elements);
    }
})();

/**
 * update selection drawing on move selected element(s)
 */
(async () => {
    const pickerMouseMove = findIterator<MouseEvent>(picker.onMousemove);
    for await ( const _event of pickerMouseMove ) {
        guides.setSelectionStyles(holder.elements);
    }
})();

/**
 * on zoom value changes
 */
(async () => {
    const zoomValues = findIterator<number>(zoom.update);
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

const editListener = new EditListener(webviewEndpoint, editPipe, figuresCollection, holder, cancelHub);
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

(async () => {
    const holdElements = findIterator<SVGElement[]>(holder.fireElements);
    for await ( const elements of holdElements ) {
        setTimeout(() => {
            if (elements.length > 0) {
                pickEndpoint.makeSetRequest({html: `selection: [${elements.map((el: any) => [el.nodeName, el.id].filter(str => str).join('#')).join(', ')}]`});
                guides.removeSelection();
                guides.drawSelection(elements);
            } else {
                pickEndpoint.makeSetRequest({html: null});
                guides.removeSelection();
            }
        }, 0);
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
    figuresCollection.delegate(shapeName)!.create(shapeName, {});
});

groupControls.groupEvent.on(_event => {
    if (holder.elements.length > 0) {
        groupListener.group();
    }
});

groupControls.ungroupEvent.on(_event => {
    groupListener.ungroup();
});

elementListener.copyElementEvent.on(_element => {
    setTimeout(() => {
        guides.setContainerStyles();
        guides.setSelectionStyles(holder.elements);
    }, 0);
});

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
    const clicks = findIterator<MouseEvent>(editPointsControl.editPoints);
    for await ( const _event of clicks ) {
        inverseInteractiveEndpoint.makeSetRequest({});
        editListener.editElement();
    }
})();
