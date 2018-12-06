import { zoomPipe } from '../shared/pipes/zoom.pipe';
import { artboardPipe } from '../shared/pipes/artboard.pipe';
import { remoteAttributePipe } from '../shared/pipes/remote-attribute.pipe';
import { createPipe } from '../shared/pipes/create.pipe';
import { flushPipe } from '../shared/pipes/flush.pipe';
import { artboard } from './src/services/artboard';
import { webviewEndpoint } from './src/services/endpoint';
import { RemoteAttributeListener } from './src/listeners/remote-attribute.listener';
import { ArtboardListener } from './src/listeners/artboard.listener';
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
import { selection } from './src/services/selection';
import { GroupListener } from './src/listeners/group.listener';
import { cancelListener } from './src/listeners';


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
const artboardListener = new ArtboardListener(webviewEndpoint, artboardPipe, artboard);
artboardListener.listen();

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
const elementListener = new ElementListener(webviewEndpoint, elementPipe, holder);
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
const pickEndpoint = webviewEndpoint.createFromPipe(pickPipe);
holder.addListener(elements => {
    if (elements.length > 0) {
        pickEndpoint.makeSetRequest({html: `selection: [${elements.map(el => [el.nodeName, el.id].filter(str => str).join('#')).join(', ')}]`});
    } else {
        pickEndpoint.makeSetRequest({html: null});
    }
});

/**
 * 
 */
selection.listen();

/**
 * 
 */
zoom.addCallback(value => {
    pickEndpoint.makeSetRequest({html: `zoom: ${Math.round(value * 100)}%`});
});
