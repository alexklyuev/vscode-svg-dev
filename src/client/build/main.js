/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/client/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/client/main.ts":
/*!****************************!*\
  !*** ./src/client/main.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst zoom_pipe_1 = __webpack_require__(/*! ../shared/pipes/zoom.pipe */ \"./src/shared/pipes/zoom.pipe.ts\");\nconst artboard_pipe_1 = __webpack_require__(/*! ../shared/pipes/artboard.pipe */ \"./src/shared/pipes/artboard.pipe.ts\");\nconst remote_attribute_pipe_1 = __webpack_require__(/*! ../shared/pipes/remote-attribute.pipe */ \"./src/shared/pipes/remote-attribute.pipe.ts\");\nconst create_pipe_1 = __webpack_require__(/*! ../shared/pipes/create.pipe */ \"./src/shared/pipes/create.pipe.ts\");\nconst flush_pipe_1 = __webpack_require__(/*! ../shared/pipes/flush.pipe */ \"./src/shared/pipes/flush.pipe.ts\");\nconst artboard_1 = __webpack_require__(/*! ./src/services/artboard */ \"./src/client/src/services/artboard/index.ts\");\nconst endpoint_1 = __webpack_require__(/*! ./src/services/endpoint */ \"./src/client/src/services/endpoint/index.ts\");\nconst remote_attribute_listener_1 = __webpack_require__(/*! ./src/listeners/remote-attribute.listener */ \"./src/client/src/listeners/remote-attribute.listener.ts\");\nconst artboard_listener_1 = __webpack_require__(/*! ./src/listeners/artboard.listener */ \"./src/client/src/listeners/artboard.listener.ts\");\nconst create_listener_1 = __webpack_require__(/*! ./src/listeners/create.listener */ \"./src/client/src/listeners/create.listener.ts\");\nconst flush_listener_1 = __webpack_require__(/*! ./src/listeners/flush.listener */ \"./src/client/src/listeners/flush.listener.ts\");\nconst zoom_listener_1 = __webpack_require__(/*! ./src/listeners/zoom.listener */ \"./src/client/src/listeners/zoom.listener.ts\");\nconst arrange_listener_1 = __webpack_require__(/*! ./src/listeners/arrange.listener */ \"./src/client/src/listeners/arrange.listener.ts\");\nconst arrange_pipe_1 = __webpack_require__(/*! ../shared/pipes/arrange.pipe */ \"./src/shared/pipes/arrange.pipe.ts\");\nconst element_pipe_1 = __webpack_require__(/*! ../shared/pipes/element.pipe */ \"./src/shared/pipes/element.pipe.ts\");\nconst pick_pipe_1 = __webpack_require__(/*! ../shared/pipes/pick.pipe */ \"./src/shared/pipes/pick.pipe.ts\");\nconst group_pipe_1 = __webpack_require__(/*! ../shared/pipes/group.pipe */ \"./src/shared/pipes/group.pipe.ts\");\nconst element_listener_1 = __webpack_require__(/*! ./src/listeners/element.listener */ \"./src/client/src/listeners/element.listener.ts\");\nconst picker_1 = __webpack_require__(/*! ./src/services/picker */ \"./src/client/src/services/picker/index.ts\");\nconst zoom_1 = __webpack_require__(/*! ./src/services/zoom */ \"./src/client/src/services/zoom/index.ts\");\nconst figures_1 = __webpack_require__(/*! ./src/figures */ \"./src/client/src/figures/index.ts\");\nconst selection_1 = __webpack_require__(/*! ./src/services/selection */ \"./src/client/src/services/selection/index.ts\");\nconst group_listener_1 = __webpack_require__(/*! ./src/listeners/group.listener */ \"./src/client/src/listeners/group.listener.ts\");\nconst listeners_1 = __webpack_require__(/*! ./src/listeners */ \"./src/client/src/listeners/index.ts\");\n/**\n *\n */\npicker_1.picker.listen();\n/**\n *\n */\nconst zoomListener = new zoom_listener_1.ZoomListener(endpoint_1.webviewEndpoint, zoom_pipe_1.zoomPipe, artboard_1.artboard, zoom_1.zoom);\nzoomListener.listen();\n/**\n *\n */\nconst artboardListener = new artboard_listener_1.ArtboardListener(endpoint_1.webviewEndpoint, artboard_pipe_1.artboardPipe, artboard_1.artboard);\nartboardListener.listen();\n/**\n *\n */\nconst remoteAttributeListener = new remote_attribute_listener_1.RemoteAttributeListener(endpoint_1.webviewEndpoint, remote_attribute_pipe_1.remoteAttributePipe, picker_1.holder);\nremoteAttributeListener.listen();\n/**\n *\n */\nconst createListener = new create_listener_1.CreateListener(endpoint_1.webviewEndpoint, create_pipe_1.createPipe, figures_1.figuresCollection);\ncreateListener.listen();\n/**\n *\n */\nconst flushListener = new flush_listener_1.FlushListener(endpoint_1.webviewEndpoint, flush_pipe_1.flushPipe, artboard_1.artboard);\nflushListener.listen();\n/**\n *\n */\nconst arrangeListener = new arrange_listener_1.ArrangeListener(endpoint_1.webviewEndpoint, arrange_pipe_1.arrangePipe, artboard_1.artboard, picker_1.holder);\narrangeListener.listen();\n/**\n *\n */\nconst elementListener = new element_listener_1.ElementListener(endpoint_1.webviewEndpoint, element_pipe_1.elementPipe, picker_1.holder);\nelementListener.listen();\n/**\n *\n */\nconst groupListener = new group_listener_1.GroupListener(endpoint_1.webviewEndpoint, group_pipe_1.groupPipe, picker_1.holder, artboard_1.artboard);\ngroupListener.listen();\n/**\n *\n */\nlisteners_1.cancelListener.listen();\n/**\n *\n */\nconst pickEndpoint = endpoint_1.webviewEndpoint.createFromPipe(pick_pipe_1.pickPipe);\npicker_1.holder.addListener(elements => {\n    if (elements.length > 0) {\n        pickEndpoint.makeSetRequest({ html: `selection: [${elements.map(el => [el.nodeName, el.id].filter(str => str).join('#')).join(', ')}]` });\n    }\n    else {\n        pickEndpoint.makeSetRequest({ html: null });\n    }\n});\n/**\n *\n */\nselection_1.selection.listen();\n/**\n *\n */\nzoom_1.zoom.addCallback(value => {\n    pickEndpoint.makeSetRequest({ html: `zoom: ${Math.round(value * 100)}%` });\n});\n\n\n//# sourceURL=webpack:///./src/client/main.ts?");

/***/ }),

/***/ "./src/client/src/decorators/rehold.decorator.ts":
/*!*******************************************************!*\
  !*** ./src/client/src/decorators/rehold.decorator.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst picker_1 = __webpack_require__(/*! ../services/picker */ \"./src/client/src/services/picker/index.ts\");\n/**\n *\n */\nfunction rehold(_instancePrototype, _propertyKey, descriptor) {\n    const orig = descriptor.value;\n    descriptor.value = function (...args) {\n        const res = orig.call(this, ...args);\n        setTimeout(() => {\n            picker_1.holder.elements = [...picker_1.holder.elements];\n        }, 0);\n        return res;\n    };\n}\nexports.rehold = rehold;\n\n\n//# sourceURL=webpack:///./src/client/src/decorators/rehold.decorator.ts?");

/***/ }),

/***/ "./src/client/src/decorators/set-state.decorator.ts":
/*!**********************************************************!*\
  !*** ./src/client/src/decorators/set-state.decorator.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst host_api_1 = __webpack_require__(/*! ../services/host-api */ \"./src/client/src/services/host-api/index.ts\");\nconst artboard_1 = __webpack_require__(/*! ../services/artboard */ \"./src/client/src/services/artboard/index.ts\");\n/**\n * class Some {\n *     @setState\n *     method() {}\n * }\n */\nfunction setState(_instancePrototype, _propertyKey, descriptor) {\n    const orig = descriptor.value;\n    descriptor.value = function (...args) {\n        const res = orig.call(this, ...args);\n        setTimeout(() => {\n            const state = artboard_1.artboard.svg.outerHTML;\n            host_api_1.host.api.setState(state);\n        }, 0);\n        return res;\n    };\n}\nexports.setState = setState;\n\n\n//# sourceURL=webpack:///./src/client/src/decorators/set-state.decorator.ts?");

/***/ }),

/***/ "./src/client/src/decorators/update-selection.decorator.ts":
/*!*****************************************************************!*\
  !*** ./src/client/src/decorators/update-selection.decorator.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst selection_1 = __webpack_require__(/*! ../services/selection */ \"./src/client/src/services/selection/index.ts\");\nfunction updateSelection(_instancePrototype, _propertyKey, descriptor) {\n    const orig = descriptor.value;\n    descriptor.value = function (...args) {\n        const res = orig.call(this, ...args);\n        setTimeout(() => {\n            selection_1.selection.update();\n        }, 0);\n        return res;\n    };\n}\nexports.updateSelection = updateSelection;\n\n\n//# sourceURL=webpack:///./src/client/src/decorators/update-selection.decorator.ts?");

/***/ }),

/***/ "./src/client/src/figures/circle.figure.ts":
/*!*************************************************!*\
  !*** ./src/client/src/figures/circle.figure.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst set_state_decorator_1 = __webpack_require__(/*! ../decorators/set-state.decorator */ \"./src/client/src/decorators/set-state.decorator.ts\");\nclass CircleFigure {\n    constructor(drag, artboard) {\n        this.drag = drag;\n        this.artboard = artboard;\n        this.name = 'circle';\n        this.ctor = SVGCircleElement;\n    }\n    testByElement(element) {\n        return element instanceof SVGCircleElement;\n    }\n    create(_elementName, _attributes) {\n        const svg = this.artboard.svg;\n        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');\n        svg.appendChild(circle);\n        circle.setAttribute('cx', '50');\n        circle.setAttribute('cy', '50');\n        circle.setAttribute('r', '30');\n        circle.setAttribute('stroke', '#ffffff');\n        circle.setAttribute('fill', '#ccc');\n    }\n}\n__decorate([\n    set_state_decorator_1.setState\n], CircleFigure.prototype, \"create\", null);\nexports.CircleFigure = CircleFigure;\n\n\n//# sourceURL=webpack:///./src/client/src/figures/circle.figure.ts?");

/***/ }),

/***/ "./src/client/src/figures/ellipse.figure.ts":
/*!**************************************************!*\
  !*** ./src/client/src/figures/ellipse.figure.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst set_state_decorator_1 = __webpack_require__(/*! ../decorators/set-state.decorator */ \"./src/client/src/decorators/set-state.decorator.ts\");\nclass EllipseFigure {\n    constructor(drag, artboard) {\n        this.drag = drag;\n        this.artboard = artboard;\n        this.name = 'ellipse';\n        this.ctor = SVGEllipseElement;\n    }\n    testByElement(element) {\n        return element instanceof SVGEllipseElement;\n    }\n    create(_elementName, _attributes) {\n        const svg = this.artboard.svg;\n        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');\n        svg.appendChild(circle);\n        circle.setAttribute('cx', '50');\n        circle.setAttribute('cy', '50');\n        circle.setAttribute('rx', '20');\n        circle.setAttribute('ry', '40');\n        circle.setAttribute('stroke', '#ffffff');\n        circle.setAttribute('fill', '#ccc');\n    }\n}\n__decorate([\n    set_state_decorator_1.setState\n], EllipseFigure.prototype, \"create\", null);\nexports.EllipseFigure = EllipseFigure;\n\n\n//# sourceURL=webpack:///./src/client/src/figures/ellipse.figure.ts?");

/***/ }),

/***/ "./src/client/src/figures/figures-collection.ts":
/*!******************************************************!*\
  !*** ./src/client/src/figures/figures-collection.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass FiguresCollection {\n    constructor() {\n        this.types = new Set();\n    }\n    add(...types) {\n        /**\n         * add types\n         */\n        types.forEach(type => this.types.add(type));\n    }\n    delegate(element) {\n        for (let type of this.types) {\n            if (typeof element === 'object' && type.testByElement(element)) {\n                return type;\n            }\n            else if (typeof element === 'string' && type.name === element) {\n                return type;\n            }\n        }\n    }\n    getFiltered(key) {\n        return Array.from(this.types).filter(t => !!t[key]);\n    }\n}\nexports.FiguresCollection = FiguresCollection;\n\n\n//# sourceURL=webpack:///./src/client/src/figures/figures-collection.ts?");

/***/ }),

/***/ "./src/client/src/figures/g.figure.ts":
/*!********************************************!*\
  !*** ./src/client/src/figures/g.figure.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst set_state_decorator_1 = __webpack_require__(/*! ../decorators/set-state.decorator */ \"./src/client/src/decorators/set-state.decorator.ts\");\nclass GFigure {\n    constructor(drag, artboard) {\n        this.drag = drag;\n        this.artboard = artboard;\n        this.name = 'g';\n        this.ctor = SVGGElement;\n    }\n    /**\n     *\n     */\n    create(_elementName, _attributes) {\n        const { svg } = this.artboard;\n        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');\n        svg.appendChild(g);\n    }\n    testByElement(element) {\n        return element instanceof SVGGElement;\n    }\n}\n__decorate([\n    set_state_decorator_1.setState\n], GFigure.prototype, \"create\", null);\nexports.GFigure = GFigure;\n\n\n//# sourceURL=webpack:///./src/client/src/figures/g.figure.ts?");

/***/ }),

/***/ "./src/client/src/figures/index.ts":
/*!*****************************************!*\
  !*** ./src/client/src/figures/index.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst figures_collection_1 = __webpack_require__(/*! ./figures-collection */ \"./src/client/src/figures/figures-collection.ts\");\nconst circle_figure_1 = __webpack_require__(/*! ./circle.figure */ \"./src/client/src/figures/circle.figure.ts\");\nconst rect_figure_1 = __webpack_require__(/*! ./rect.figure */ \"./src/client/src/figures/rect.figure.ts\");\nconst text_figure_1 = __webpack_require__(/*! ./text.figure */ \"./src/client/src/figures/text.figure.ts\");\nconst artboard_1 = __webpack_require__(/*! ../services/artboard */ \"./src/client/src/services/artboard/index.ts\");\nconst zoom_1 = __webpack_require__(/*! ../services/zoom */ \"./src/client/src/services/zoom/index.ts\");\nconst g_figure_1 = __webpack_require__(/*! ./g.figure */ \"./src/client/src/figures/g.figure.ts\");\nconst ellipse_figure_1 = __webpack_require__(/*! ./ellipse.figure */ \"./src/client/src/figures/ellipse.figure.ts\");\nconst line_figure_1 = __webpack_require__(/*! ./line.figure */ \"./src/client/src/figures/line.figure.ts\");\nconst dragger_value_1 = __webpack_require__(/*! ../services/dragger/dragger-value */ \"./src/client/src/services/dragger/dragger-value.ts\");\nconst dragger_delegate_1 = __webpack_require__(/*! ../services/dragger/dragger-delegate */ \"./src/client/src/services/dragger/dragger-delegate.ts\");\nconst listeners_1 = __webpack_require__(/*! ../listeners */ \"./src/client/src/listeners/index.ts\");\nconst user_event_1 = __webpack_require__(/*! ../services/user-event */ \"./src/client/src/services/user-event/index.ts\");\nconst polygon_figure_1 = __webpack_require__(/*! ./polygon.figure */ \"./src/client/src/figures/polygon.figure.ts\");\nconst dragger_points_1 = __webpack_require__(/*! ../services/dragger/dragger-points */ \"./src/client/src/services/dragger/dragger-points.ts\");\nconst figuresCollection = new figures_collection_1.FiguresCollection();\nexports.figuresCollection = figuresCollection;\nconst draggerLeftTop = new dragger_value_1.DraggerValue(['x'], ['y'], zoom_1.zoom);\nconst draggerCenter = new dragger_value_1.DraggerValue(['cx'], ['cy'], zoom_1.zoom);\nconst draggerDouble = new dragger_value_1.DraggerValue(['x1', 'x2'], ['y1', 'y2'], zoom_1.zoom);\nconst draggerPoints = new dragger_points_1.DraggerPoints(zoom_1.zoom);\nconst draggerDelegate = new dragger_delegate_1.DraggerDelegate(figuresCollection);\nfiguresCollection.add(new circle_figure_1.CircleFigure(draggerCenter, artboard_1.artboard), new ellipse_figure_1.EllipseFigure(draggerCenter, artboard_1.artboard), new rect_figure_1.RectFigure(draggerLeftTop, artboard_1.artboard), new text_figure_1.TextFigure(draggerLeftTop, artboard_1.artboard), new g_figure_1.GFigure(draggerDelegate, artboard_1.artboard), new line_figure_1.LineFigure(draggerDouble, artboard_1.artboard, zoom_1.zoom, listeners_1.cancelListener, user_event_1.userEventMan), new polygon_figure_1.PolygonFigure(draggerPoints, artboard_1.artboard, zoom_1.zoom, listeners_1.cancelListener, user_event_1.userEventMan));\n\n\n//# sourceURL=webpack:///./src/client/src/figures/index.ts?");

/***/ }),

/***/ "./src/client/src/figures/line.figure.ts":
/*!***********************************************!*\
  !*** ./src/client/src/figures/line.figure.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst set_state_decorator_1 = __webpack_require__(/*! ../decorators/set-state.decorator */ \"./src/client/src/decorators/set-state.decorator.ts\");\nclass LineFigure {\n    constructor(drag, artboard, zoom, cancelListener, userEventMan) {\n        this.drag = drag;\n        this.artboard = artboard;\n        this.zoom = zoom;\n        this.cancelListener = cancelListener;\n        this.userEventMan = userEventMan;\n        this.name = 'line';\n        this.ctor = SVGLineElement;\n    }\n    testByElement(element) {\n        return element instanceof SVGLineElement;\n    }\n    create(_elementName, _attributes) {\n        let points = Array();\n        this.artboard.box.classList.add('interactive-points');\n        let toolsSvg = null;\n        this.userEventMan.mode = 'interactive';\n        const pointsListener = (event) => {\n            let { clientX, clientY, shiftKey } = event;\n            const { scrollLeft, scrollTop } = document.scrollingElement;\n            if (points.length === 1 && shiftKey) {\n                let [[prevX, prevY]] = points;\n                prevX -= scrollLeft;\n                prevY -= scrollTop;\n                const absDeltaX = Math.abs(clientX - prevX);\n                const absDeltaY = Math.abs(clientY - prevY);\n                if (absDeltaX < absDeltaY) {\n                    clientX = points[0][0] - scrollLeft;\n                }\n                else {\n                    clientY = points[0][1] - scrollTop;\n                }\n            }\n            points.push([\n                clientX + scrollLeft,\n                clientY + scrollTop,\n            ]);\n            if (points.length === 1) {\n                const [[cx, cy]] = points;\n                toolsSvg = this.createEditingSelection(cx, cy);\n            }\n            if (points.length >= 2) {\n                cancel();\n                const [[x1, y1], [x2, y2]] = points;\n                const attrs = { x1, y1, x2, y2 };\n                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');\n                Object.keys(attrs).forEach(key => {\n                    const value = attrs[key];\n                    line.setAttribute(key, `${Math.round(value / this.zoom.value)}`);\n                });\n                line.setAttribute('stroke', '#777');\n                this.artboard.svg.appendChild(line);\n            }\n        };\n        window.addEventListener('click', pointsListener);\n        const cancel = () => {\n            window.removeEventListener('click', pointsListener);\n            this.cancelListener.removeCallback(cancel);\n            this.artboard.box.classList.remove('interactive-points');\n            if (toolsSvg) {\n                this.artboard.tools.removeChild(toolsSvg);\n            }\n            this.userEventMan.mode = 'pick';\n        };\n        this.cancelListener.addCallback(cancel);\n    }\n    createEditingSelection(cx, cy) {\n        const { scrollLeft, scrollTop } = document.scrollingElement;\n        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');\n        const pseudoPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');\n        const pseudoLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');\n        const artboardBox = this.artboard.svg.getBoundingClientRect();\n        const artboardWidth = parseInt(this.artboard.svg.getAttribute('width'));\n        const artboardHeight = parseInt(this.artboard.svg.getAttribute('height'));\n        svg.setAttribute('width', String(this.zoom.value * artboardWidth));\n        svg.setAttribute('height', String(this.zoom.value * artboardHeight));\n        pseudoPoint.setAttribute('fill', 'none');\n        pseudoPoint.setAttribute('stroke', '#777');\n        pseudoPoint.setAttribute('stroke-dasharray', '1');\n        pseudoPoint.setAttribute('r', '3');\n        pseudoPoint.setAttribute('cx', `${cx}`);\n        pseudoPoint.setAttribute('cy', `${cy}`);\n        pseudoLine.setAttribute('x1', `${cx}`);\n        pseudoLine.setAttribute('y1', `${cy}`);\n        pseudoLine.setAttribute('x2', `${cx}`);\n        pseudoLine.setAttribute('y2', `${cy}`);\n        pseudoLine.setAttribute('stroke', '#777');\n        pseudoLine.setAttribute('stroke-dasharray', '1');\n        const onMousemove = (event) => {\n            let { clientX, clientY, shiftKey } = event;\n            const prevX = cx - scrollLeft;\n            const prevY = cy - scrollTop;\n            const absDeltaX = Math.abs(clientX - prevX);\n            const absDeltaY = Math.abs(clientY - prevY);\n            if (shiftKey) {\n                if (absDeltaX < absDeltaY) {\n                    clientX = cx - scrollLeft;\n                }\n                else {\n                    clientY = cy - scrollTop;\n                }\n            }\n            pseudoLine.setAttribute('x2', `${clientX + scrollLeft}`);\n            pseudoLine.setAttribute('y2', `${clientY + scrollTop}`);\n        };\n        const onClick = (_click) => {\n            window.removeEventListener('mousemove', onMousemove);\n            window.removeEventListener('click', onClick);\n        };\n        window.addEventListener('mousemove', onMousemove);\n        window.addEventListener('click', onClick);\n        Object.assign(svg.style, {\n            position: 'absolute',\n            top: artboardBox.top + scrollTop + 'px',\n            left: artboardBox.left + scrollLeft + 'px',\n        });\n        this.artboard.tools.appendChild(svg);\n        svg.appendChild(pseudoPoint);\n        svg.appendChild(pseudoLine);\n        return svg;\n    }\n}\n__decorate([\n    set_state_decorator_1.setState\n], LineFigure.prototype, \"create\", null);\nexports.LineFigure = LineFigure;\n\n\n//# sourceURL=webpack:///./src/client/src/figures/line.figure.ts?");

/***/ }),

/***/ "./src/client/src/figures/polygon.figure.ts":
/*!**************************************************!*\
  !*** ./src/client/src/figures/polygon.figure.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst set_state_decorator_1 = __webpack_require__(/*! ../decorators/set-state.decorator */ \"./src/client/src/decorators/set-state.decorator.ts\");\nclass PolygonFigure {\n    constructor(drag, artboard, zoom, cancelListener, userEventMan) {\n        this.drag = drag;\n        this.artboard = artboard;\n        this.zoom = zoom;\n        this.cancelListener = cancelListener;\n        this.userEventMan = userEventMan;\n        this.name = 'polygon';\n        this.ctor = SVGPolygonElement;\n    }\n    testByElement(element) {\n        return element instanceof SVGPolygonElement;\n    }\n    create(_elementName, _attributest) {\n        let points = Array();\n        this.artboard.box.classList.add('interactive-points');\n        let toolsSvgRemover = null;\n        this.userEventMan.mode = 'interactive';\n        const pointsListener = (event) => {\n            const { clientX, clientY } = event;\n            const { scrollLeft, scrollTop } = document.scrollingElement;\n            points.push([\n                [clientX, scrollLeft],\n                [clientY, scrollTop],\n            ]);\n            if (toolsSvgRemover instanceof Function) {\n                toolsSvgRemover();\n                toolsSvgRemover = null;\n            }\n            toolsSvgRemover = this.renderTools(points);\n        };\n        window.addEventListener('click', pointsListener);\n        const stop = () => {\n            window.removeEventListener('click', pointsListener);\n            this.cancelListener.removeCallback(stop);\n            this.artboard.box.classList.remove('interactive-points');\n            if (toolsSvgRemover instanceof Function) {\n                toolsSvgRemover();\n                toolsSvgRemover = null;\n            }\n            this.userEventMan.mode = 'pick';\n            this.render(points);\n        };\n        this.cancelListener.addCallback(stop);\n    }\n    render(points) {\n        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');\n        poly.setAttribute('stroke', '#777');\n        poly.setAttribute('fill', '#555');\n        poly.setAttribute('points', points.map(([[cX, sX], [cY, sY]]) => {\n            return `${(cX + sX) / this.zoom.value},${(cY + sY) / this.zoom.value}`;\n        }).join(' '));\n        this.artboard.svg.appendChild(poly);\n    }\n    renderTools(points) {\n        const { scrollLeft, scrollTop } = document.scrollingElement;\n        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');\n        const artboardBox = this.artboard.svg.getBoundingClientRect();\n        const artboardWidth = parseInt(this.artboard.svg.getAttribute('width'));\n        const artboardHeight = parseInt(this.artboard.svg.getAttribute('height'));\n        svg.setAttribute('width', String(this.zoom.value * artboardWidth));\n        svg.setAttribute('height', String(this.zoom.value * artboardHeight));\n        Object.assign(svg.style, {\n            position: 'absolute',\n            top: artboardBox.top + scrollTop + 'px',\n            left: artboardBox.left + scrollLeft + 'px',\n        });\n        this.artboard.tools.appendChild(svg);\n        points.forEach(([[cX, sX], [cY, sY]], index) => {\n            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');\n            circle.setAttribute('cx', `${cX + sX}`);\n            circle.setAttribute('cy', `${cY + sY}`);\n            circle.setAttribute('r', `${3}`);\n            circle.setAttribute('fill', 'none');\n            circle.setAttribute('stroke', '#777');\n            circle.setAttribute('stroke-dasharray', '1');\n            svg.appendChild(circle);\n            if (index > 0) {\n                const [[cXprev, sXprev], [cYprev, sYprev]] = points[index - 1];\n                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');\n                const attrs = {\n                    'stroke': '#777',\n                    'stroke-dasharray': '1',\n                    'x1': `${cXprev + sXprev}`,\n                    'y1': `${cYprev + sYprev}`,\n                    'x2': `${cX + sX}`,\n                    'y2': `${cY + sY}`,\n                };\n                Object.keys(attrs).forEach(key => {\n                    const val = attrs[key];\n                    line.setAttribute(key, val);\n                });\n                svg.appendChild(line);\n            }\n        });\n        let mousemoveRemover = () => { };\n        if (points.length > 0) {\n            const [[cX, sX], [cY, sY]] = points[points.length - 1];\n            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');\n            svg.appendChild(line);\n            const attrs = {\n                'stroke': '#777',\n                'stroke-dasharray': '1',\n                'x1': `${cX + sX}`,\n                'y1': `${cY + sY}`,\n                'x2': `${cX + sX}`,\n                'y2': `${cY + sY}`,\n            };\n            Object.keys(attrs).forEach(key => {\n                const val = attrs[key];\n                line.setAttribute(key, val);\n            });\n            const onMousemove = (event) => {\n                const { clientX, clientY } = event;\n                const { scrollLeft, scrollTop } = document.scrollingElement;\n                line.setAttribute('x2', `${clientX + scrollLeft}`);\n                line.setAttribute('y2', `${clientY + scrollTop}`);\n            };\n            window.addEventListener('mousemove', onMousemove);\n            mousemoveRemover = () => window.removeEventListener('mousemove', onMousemove);\n        }\n        return () => {\n            mousemoveRemover();\n            this.artboard.tools.removeChild(svg);\n        };\n    }\n}\n__decorate([\n    set_state_decorator_1.setState\n], PolygonFigure.prototype, \"create\", null);\nexports.PolygonFigure = PolygonFigure;\n\n\n//# sourceURL=webpack:///./src/client/src/figures/polygon.figure.ts?");

/***/ }),

/***/ "./src/client/src/figures/rect.figure.ts":
/*!***********************************************!*\
  !*** ./src/client/src/figures/rect.figure.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst set_state_decorator_1 = __webpack_require__(/*! ../decorators/set-state.decorator */ \"./src/client/src/decorators/set-state.decorator.ts\");\nclass RectFigure {\n    constructor(drag, artboard) {\n        this.drag = drag;\n        this.artboard = artboard;\n        this.name = 'rect';\n        this.ctor = SVGRectElement;\n    }\n    create(_elementName, _attributes) {\n        const svg = this.artboard.svg;\n        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');\n        svg.appendChild(rect);\n        rect.setAttribute('x', '50');\n        rect.setAttribute('y', '50');\n        rect.setAttribute('width', '50');\n        rect.setAttribute('height', '50');\n        rect.setAttribute('stroke', '#ffffff');\n        rect.setAttribute('fill', '#ccc');\n    }\n    testByElement(element) {\n        return element instanceof SVGRectElement;\n    }\n}\n__decorate([\n    set_state_decorator_1.setState\n], RectFigure.prototype, \"create\", null);\nexports.RectFigure = RectFigure;\n\n\n//# sourceURL=webpack:///./src/client/src/figures/rect.figure.ts?");

/***/ }),

/***/ "./src/client/src/figures/text.figure.ts":
/*!***********************************************!*\
  !*** ./src/client/src/figures/text.figure.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst set_state_decorator_1 = __webpack_require__(/*! ../decorators/set-state.decorator */ \"./src/client/src/decorators/set-state.decorator.ts\");\nclass TextFigure {\n    constructor(drag, artboard) {\n        this.drag = drag;\n        this.artboard = artboard;\n        this.name = 'text';\n        this.ctor = SVGTextElement;\n    }\n    create(_elementName, attributes) {\n        const svg = this.artboard.svg;\n        const text = document.createElementNS('http://www.w3.org/2000/svg', this.name);\n        svg.appendChild(text);\n        text.setAttribute('x', '50');\n        text.setAttribute('y', '50');\n        text.setAttribute('fill', '#ccc');\n        text.setAttribute('style', 'font-family: sans-serif; font-size: 20px');\n        Object.keys(attributes).forEach(attrName => {\n            const attrValue = attributes[attrName];\n            switch (attrName) {\n                case 'innerText':\n                    text.innerHTML = attrValue;\n                    break;\n                default:\n                    text.setAttribute(attrName, attrValue);\n                    break;\n            }\n        });\n    }\n    testByElement(element) {\n        return element instanceof this.ctor;\n    }\n}\n__decorate([\n    set_state_decorator_1.setState\n], TextFigure.prototype, \"create\", null);\nexports.TextFigure = TextFigure;\n\n\n//# sourceURL=webpack:///./src/client/src/figures/text.figure.ts?");

/***/ }),

/***/ "./src/client/src/listeners/arrange.listener.ts":
/*!******************************************************!*\
  !*** ./src/client/src/listeners/arrange.listener.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst set_state_decorator_1 = __webpack_require__(/*! ../decorators/set-state.decorator */ \"./src/client/src/decorators/set-state.decorator.ts\");\nclass ArrangeListener {\n    constructor(webviewEndpoint, arrangePipe, artboard, holder) {\n        this.webviewEndpoint = webviewEndpoint;\n        this.arrangePipe = arrangePipe;\n        this.artboard = artboard;\n        this.holder = holder;\n        this.arrangeClient = this.webviewEndpoint.createFromPipe(this.arrangePipe);\n    }\n    listen() {\n        this.arrangeClient.listenSetRequest(_request => this.holder.elements, (request, elements) => {\n            elements.forEach(element => {\n                this.arrange(element, request);\n            });\n        });\n    }\n    arrange(element, request) {\n        switch (request) {\n            case 'bringToFront':\n                this.artboard.svg.appendChild(element);\n                break;\n            case 'sendToBack':\n                const { firstChild } = this.artboard.svg;\n                if (firstChild) {\n                    this.artboard.svg.insertBefore(element, firstChild);\n                }\n                break;\n            case 'moveForward':\n                const { childNodes: childNodes1 } = this.artboard.svg;\n                const selfIndex1 = Array.from(childNodes1).reduce((akk, child, index) => {\n                    return child === element ? index : akk;\n                }, -1);\n                const anchorIndex = selfIndex1 + 2;\n                const anchor = childNodes1[anchorIndex];\n                if (anchor) {\n                    this.artboard.svg.insertBefore(element, anchor);\n                }\n                else {\n                    this.artboard.svg.appendChild(element);\n                }\n                break;\n            case 'moveBackward':\n                const { childNodes: childNodes2 } = this.artboard.svg;\n                const selfIndex2 = Array.from(childNodes2).reduce((akk, child, index) => {\n                    return child === element ? index : akk;\n                }, -1);\n                const prevIndex = selfIndex2 - 1;\n                const prev = childNodes2[prevIndex];\n                if (prev) {\n                    this.artboard.svg.insertBefore(element, prev);\n                }\n                break;\n        }\n    }\n}\n__decorate([\n    set_state_decorator_1.setState\n], ArrangeListener.prototype, \"arrange\", null);\nexports.ArrangeListener = ArrangeListener;\n\n\n//# sourceURL=webpack:///./src/client/src/listeners/arrange.listener.ts?");

/***/ }),

/***/ "./src/client/src/listeners/artboard.listener.ts":
/*!*******************************************************!*\
  !*** ./src/client/src/listeners/artboard.listener.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst set_state_decorator_1 = __webpack_require__(/*! ../decorators/set-state.decorator */ \"./src/client/src/decorators/set-state.decorator.ts\");\nclass ArtboardListener {\n    constructor(webviewEndpoint, artboardPipe, artboard) {\n        this.webviewEndpoint = webviewEndpoint;\n        this.artboardPipe = artboardPipe;\n        this.artboard = artboard;\n        this.artboardClient = this.webviewEndpoint.createFromPipe(this.artboardPipe);\n    }\n    listen() {\n        this.artboardClient.listenGetRequest(_request => this.artboard.svg, (request, svg) => {\n            const { property } = request;\n            return { value: svg.getAttribute(property) };\n        });\n        this.artboardClient.listenSetRequest(_request => this.artboard.svg, ({ property, value }, svg) => {\n            this.updateAttributes(svg, property, value);\n        });\n    }\n    updateAttributes(svg, property, value) {\n        svg.setAttribute(property, value);\n        if (property === 'width' || property === 'height') {\n            let [, , width, height] = svg.getAttribute('viewBox').split(' ');\n            if (property === 'width') {\n                width = value;\n            }\n            if (property === 'height') {\n                height = value;\n            }\n            svg.setAttribute('viewBox', [0, 0, width, height].join(' '));\n        }\n    }\n}\n__decorate([\n    set_state_decorator_1.setState\n], ArtboardListener.prototype, \"updateAttributes\", null);\nexports.ArtboardListener = ArtboardListener;\n\n\n//# sourceURL=webpack:///./src/client/src/listeners/artboard.listener.ts?");

/***/ }),

/***/ "./src/client/src/listeners/cancel.listener.ts":
/*!*****************************************************!*\
  !*** ./src/client/src/listeners/cancel.listener.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass CancelListener {\n    constructor(webviewEndpoint, cancelPipe) {\n        this.webviewEndpoint = webviewEndpoint;\n        this.cancelPipe = cancelPipe;\n        this.callbacks = new Set();\n        this.endpoint = this.webviewEndpoint.createFromPipe(this.cancelPipe);\n    }\n    listen() {\n        this.endpoint.listenSetRequest(_request => true, (_cancel, _true) => {\n            this.callbacks.forEach(cb => cb());\n        });\n    }\n    addCallback(callback) {\n        this.callbacks.add(callback);\n    }\n    removeCallback(callback) {\n        this.callbacks.delete(callback);\n    }\n}\nexports.CancelListener = CancelListener;\n\n\n//# sourceURL=webpack:///./src/client/src/listeners/cancel.listener.ts?");

/***/ }),

/***/ "./src/client/src/listeners/create.listener.ts":
/*!*****************************************************!*\
  !*** ./src/client/src/listeners/create.listener.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst set_state_decorator_1 = __webpack_require__(/*! ../decorators/set-state.decorator */ \"./src/client/src/decorators/set-state.decorator.ts\");\nclass CreateListener {\n    constructor(webviewEndpoint, createPipe, figuresCollection) {\n        this.webviewEndpoint = webviewEndpoint;\n        this.createPipe = createPipe;\n        this.figuresCollection = figuresCollection;\n        this.createClient = this.webviewEndpoint.createFromPipe(this.createPipe);\n    }\n    listen() {\n        this.createClient.listenSetRequest(_request => true, ({ elementName, attributes }, _true) => {\n            this.createElement(elementName, attributes);\n        });\n    }\n    createElement(elementName, attributes) {\n        const delegate = this.figuresCollection.delegate(elementName);\n        if (delegate) {\n            delegate.create(elementName, attributes);\n        }\n    }\n}\n__decorate([\n    set_state_decorator_1.setState\n], CreateListener.prototype, \"createElement\", null);\nexports.CreateListener = CreateListener;\n\n\n//# sourceURL=webpack:///./src/client/src/listeners/create.listener.ts?");

/***/ }),

/***/ "./src/client/src/listeners/element.listener.ts":
/*!******************************************************!*\
  !*** ./src/client/src/listeners/element.listener.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst set_state_decorator_1 = __webpack_require__(/*! ../decorators/set-state.decorator */ \"./src/client/src/decorators/set-state.decorator.ts\");\nclass ElementListener {\n    constructor(webviewEndpoint, elementPipe, holder) {\n        this.webviewEndpoint = webviewEndpoint;\n        this.elementPipe = elementPipe;\n        this.holder = holder;\n        this.elementReceiver = this.webviewEndpoint.createFromPipe(this.elementPipe);\n    }\n    listen() {\n        this.elementReceiver.listenSetRequest(_request => this.holder.elements, (command, elements) => {\n            elements.forEach(element => {\n                this.applyCommand(command, element);\n            });\n            this.holder.elements = [];\n        });\n    }\n    applyCommand(command, element) {\n        switch (command) {\n            case 'delete':\n                element.remove();\n                break;\n        }\n    }\n}\n__decorate([\n    set_state_decorator_1.setState\n], ElementListener.prototype, \"applyCommand\", null);\nexports.ElementListener = ElementListener;\n\n\n//# sourceURL=webpack:///./src/client/src/listeners/element.listener.ts?");

/***/ }),

/***/ "./src/client/src/listeners/flush.listener.ts":
/*!****************************************************!*\
  !*** ./src/client/src/listeners/flush.listener.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass FlushListener {\n    constructor(webviewEndpoint, flushPipe, artboard) {\n        this.webviewEndpoint = webviewEndpoint;\n        this.flushPipe = flushPipe;\n        this.artboard = artboard;\n        this.flushEndpoint = this.webviewEndpoint.createFromPipe(this.flushPipe);\n    }\n    listen() {\n        this.flushEndpoint.listenGetRequest(_request => this.artboard.svg, ({}, svg) => {\n            return { content: svg.outerHTML };\n        });\n    }\n}\nexports.FlushListener = FlushListener;\n\n\n//# sourceURL=webpack:///./src/client/src/listeners/flush.listener.ts?");

/***/ }),

/***/ "./src/client/src/listeners/group.listener.ts":
/*!****************************************************!*\
  !*** ./src/client/src/listeners/group.listener.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst set_state_decorator_1 = __webpack_require__(/*! ../decorators/set-state.decorator */ \"./src/client/src/decorators/set-state.decorator.ts\");\nclass GroupListener {\n    constructor(webviewEndpoinnt, groupPipe, holder, artboard) {\n        this.webviewEndpoinnt = webviewEndpoinnt;\n        this.groupPipe = groupPipe;\n        this.holder = holder;\n        this.artboard = artboard;\n        this.groupClient = this.webviewEndpoinnt.createFromPipe(this.groupPipe);\n    }\n    listen() {\n        this.groupClient.listenSetRequest(_reguest => this.holder.elements.length > 0, (command, _true) => {\n            this.processCommand(command);\n        });\n    }\n    /**\n     *\n     */\n    processCommand(command) {\n        switch (command) {\n            case 'group':\n                this.group();\n                break;\n            case 'ungroup':\n                this.ungroup();\n                break;\n        }\n    }\n    /**\n     *\n     */\n    group() {\n        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');\n        this.artboard.svg.appendChild(g);\n        this.holder.elements.forEach(el => g.appendChild(el));\n        this.holder.elements = [g];\n    }\n    /**\n     *\n     */\n    ungroup() {\n        this.holder.elements\n            .filter(el => el instanceof SVGGElement)\n            .forEach(g => {\n            const parent = g.parentElement;\n            const children = Array.from(g.children);\n            children.forEach(child => {\n                parent.appendChild(child);\n            });\n            parent.removeChild(g);\n            this.holder.elements = children;\n        });\n    }\n}\n__decorate([\n    set_state_decorator_1.setState\n], GroupListener.prototype, \"processCommand\", null);\nexports.GroupListener = GroupListener;\n\n\n//# sourceURL=webpack:///./src/client/src/listeners/group.listener.ts?");

/***/ }),

/***/ "./src/client/src/listeners/index.ts":
/*!*******************************************!*\
  !*** ./src/client/src/listeners/index.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst cancel_listener_1 = __webpack_require__(/*! ./cancel.listener */ \"./src/client/src/listeners/cancel.listener.ts\");\nconst endpoint_1 = __webpack_require__(/*! ../services/endpoint */ \"./src/client/src/services/endpoint/index.ts\");\nconst cancel_pipe_1 = __webpack_require__(/*! ../../../shared/pipes/cancel.pipe */ \"./src/shared/pipes/cancel.pipe.ts\");\nexports.cancelListener = new cancel_listener_1.CancelListener(endpoint_1.webviewEndpoint, cancel_pipe_1.cancelPipe);\n\n\n//# sourceURL=webpack:///./src/client/src/listeners/index.ts?");

/***/ }),

/***/ "./src/client/src/listeners/remote-attribute.listener.ts":
/*!***************************************************************!*\
  !*** ./src/client/src/listeners/remote-attribute.listener.ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst set_state_decorator_1 = __webpack_require__(/*! ../decorators/set-state.decorator */ \"./src/client/src/decorators/set-state.decorator.ts\");\nconst update_selection_decorator_1 = __webpack_require__(/*! ../decorators/update-selection.decorator */ \"./src/client/src/decorators/update-selection.decorator.ts\");\nconst rehold_decorator_1 = __webpack_require__(/*! ../decorators/rehold.decorator */ \"./src/client/src/decorators/rehold.decorator.ts\");\nclass RemoteAttributeListener {\n    constructor(webviewEndpoint, remoteAttributePipe, holder) {\n        this.webviewEndpoint = webviewEndpoint;\n        this.remoteAttributePipe = remoteAttributePipe;\n        this.holder = holder;\n        this.remoteAttributeClient = this.webviewEndpoint.createFromPipe(this.remoteAttributePipe);\n    }\n    /**\n     *\n     */\n    listen() {\n        this.remoteAttributeClient.listenGetRequest(_request => this.holder.elements, ({ attribute }, element) => {\n            const value = this.getAttribute(element[0], attribute);\n            return { value };\n        });\n        this.remoteAttributeClient.listenSetRequest(_request => this.holder.elements, ({ attribute, value }, elements) => {\n            elements.forEach(element => {\n                if (value) {\n                    this.setAttribute(element, attribute, value);\n                }\n                else if (typeof value === 'string' && value.trim() === '') {\n                    this.removeAttribute(element, attribute);\n                }\n            });\n        });\n    }\n    /**\n     *\n     */\n    getAttribute(element, attribute) {\n        switch (attribute) {\n            case 'innerText': return element.innerHTML;\n            default: return element.getAttribute(attribute);\n        }\n    }\n    /**\n     *\n     */\n    setAttribute(element, attribute, value) {\n        switch (attribute) {\n            case 'innerText':\n                element.innerHTML = value;\n                break;\n            default:\n                element.setAttribute(attribute, value);\n                break;\n        }\n    }\n    /**\n     *\n     */\n    removeAttribute(element, attribute) {\n        switch (attribute) {\n            case 'innerText':\n                element.innerHTML = '';\n                break;\n            default: element.removeAttribute(attribute);\n        }\n    }\n}\n__decorate([\n    update_selection_decorator_1.updateSelection,\n    rehold_decorator_1.rehold,\n    set_state_decorator_1.setState\n], RemoteAttributeListener.prototype, \"setAttribute\", null);\n__decorate([\n    update_selection_decorator_1.updateSelection,\n    rehold_decorator_1.rehold,\n    set_state_decorator_1.setState\n], RemoteAttributeListener.prototype, \"removeAttribute\", null);\nexports.RemoteAttributeListener = RemoteAttributeListener;\n\n\n//# sourceURL=webpack:///./src/client/src/listeners/remote-attribute.listener.ts?");

/***/ }),

/***/ "./src/client/src/listeners/zoom.listener.ts":
/*!***************************************************!*\
  !*** ./src/client/src/listeners/zoom.listener.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst update_selection_decorator_1 = __webpack_require__(/*! ../decorators/update-selection.decorator */ \"./src/client/src/decorators/update-selection.decorator.ts\");\nclass ZoomListener {\n    constructor(webviewEndpoint, zoomPipe, artboard, zoom) {\n        this.webviewEndpoint = webviewEndpoint;\n        this.zoomPipe = zoomPipe;\n        this.artboard = artboard;\n        this.zoom = zoom;\n        this.zoomer = this.webviewEndpoint.createFromPipe(this.zoomPipe);\n    }\n    listen() {\n        this.zoomer.listenSetRequest(_request => this.artboard.box, (request, _box) => {\n            const { delta, abs } = request;\n            // this.zoom.update(delta, abs);\n            this.updateZoom(delta, abs);\n        });\n    }\n    updateZoom(delta, abs) {\n        this.zoom.update(delta, abs);\n    }\n}\n__decorate([\n    update_selection_decorator_1.updateSelection\n], ZoomListener.prototype, \"updateZoom\", null);\nexports.ZoomListener = ZoomListener;\n\n\n//# sourceURL=webpack:///./src/client/src/listeners/zoom.listener.ts?");

/***/ }),

/***/ "./src/client/src/services/artboard/artboard.ts":
/*!******************************************************!*\
  !*** ./src/client/src/services/artboard/artboard.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n *\n */\nclass Artboard {\n    constructor() {\n        this.svgElement = null;\n        this.containerHtmlElement = null;\n        this.toolsElement = null;\n    }\n    get svg() {\n        if (!this.svgElement) {\n            this.svgElement = document.querySelector('#artboard svg');\n        }\n        return this.svgElement;\n    }\n    get box() {\n        if (!this.containerHtmlElement) {\n            this.containerHtmlElement = document.querySelector('#artboard');\n        }\n        return this.containerHtmlElement;\n    }\n    get tools() {\n        if (!this.toolsElement) {\n            this.toolsElement = document.querySelector('#tools');\n        }\n        return this.toolsElement;\n    }\n    clearCache() {\n        this.svgElement = null;\n        this.containerHtmlElement = null;\n        this.toolsElement = null;\n    }\n}\nexports.Artboard = Artboard;\n\n\n//# sourceURL=webpack:///./src/client/src/services/artboard/artboard.ts?");

/***/ }),

/***/ "./src/client/src/services/artboard/index.ts":
/*!***************************************************!*\
  !*** ./src/client/src/services/artboard/index.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst artboard_1 = __webpack_require__(/*! ./artboard */ \"./src/client/src/services/artboard/artboard.ts\");\nexports.artboard = new artboard_1.Artboard();\n\n\n//# sourceURL=webpack:///./src/client/src/services/artboard/index.ts?");

/***/ }),

/***/ "./src/client/src/services/dragger/dragger-delegate.ts":
/*!*************************************************************!*\
  !*** ./src/client/src/services/dragger/dragger-delegate.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass DraggerDelegate {\n    constructor(figuresCollection) {\n        this.figuresCollection = figuresCollection;\n    }\n    onMousedown(element, clientX, clientY) {\n        Array.from(element.children).forEach(child => {\n            const delegate = this.figuresCollection.delegate(child);\n            if (delegate) {\n                delegate.drag.onMousedown(child, clientX, clientY);\n            }\n        });\n    }\n    onMousemove(element, clientX, clientY) {\n        Array.from(element.children).forEach(child => {\n            const delegate = this.figuresCollection.delegate(child);\n            if (delegate) {\n                delegate.drag.onMousemove(child, clientX, clientY);\n            }\n        });\n    }\n    onMouseup(element, clientX, clientY) {\n        Array.from(element.children).forEach(child => {\n            const delegate = this.figuresCollection.delegate(child);\n            if (delegate) {\n                delegate.drag.onMouseup(child, clientX, clientY);\n            }\n        });\n    }\n}\nexports.DraggerDelegate = DraggerDelegate;\n\n\n//# sourceURL=webpack:///./src/client/src/services/dragger/dragger-delegate.ts?");

/***/ }),

/***/ "./src/client/src/services/dragger/dragger-points.ts":
/*!***********************************************************!*\
  !*** ./src/client/src/services/dragger/dragger-points.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass DraggerPoints {\n    constructor(zoom) {\n        this.zoom = zoom;\n        this.pointsStore = new Map();\n    }\n    onMousedown(element, clientX, clientY) {\n        this.pointsStore.set(element, element.getAttribute('points')\n            .split(/\\s/)\n            .map(pair => pair\n            .trim()\n            .split(',')\n            .map(val => parseInt(val)))\n            .map(([pX, pY]) => [\n            Math.round(clientX - (pX * this.zoom.value)),\n            Math.round(clientY - (pY * this.zoom.value)),\n        ]));\n    }\n    onMousemove(element, clientX, clientY) {\n        const storePoints = this.pointsStore.get(element);\n        const newPoints = storePoints\n            .map(([sX, sY]) => [\n            Math.round((clientX - sX) / this.zoom.value),\n            Math.round((clientY - sY) / this.zoom.value),\n        ])\n            .map(pair => pair.join(','))\n            .join(' ');\n        element.setAttribute('points', newPoints);\n    }\n    onMouseup(element, _clientX, _clientY) { }\n}\nexports.DraggerPoints = DraggerPoints;\n\n\n//# sourceURL=webpack:///./src/client/src/services/dragger/dragger-points.ts?");

/***/ }),

/***/ "./src/client/src/services/dragger/dragger-value.ts":
/*!**********************************************************!*\
  !*** ./src/client/src/services/dragger/dragger-value.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass DraggerValue {\n    constructor(xAttrs, yAttrs, zoom) {\n        this.xAttrs = xAttrs;\n        this.yAttrs = yAttrs;\n        this.zoom = zoom;\n        this.attrsStore = new Map();\n    }\n    onMousedown(element, clientX, clientY) {\n        this.attrsStore.set(element, Object.assign({}, this.xAttrs.reduce((akk, key) => {\n            akk[key] = this.getValueAttr(element, key, clientX);\n            return akk;\n        }, {}), this.yAttrs.reduce((akk, key) => {\n            akk[key] = this.getValueAttr(element, key, clientY);\n            return akk;\n        }, {})));\n    }\n    onMousemove(element, clientX, clientY) {\n        const storeVals = this.attrsStore.get(element);\n        this.xAttrs.forEach(key => {\n            const val = Math.round((clientX - storeVals[key]) / this.zoom.value);\n            element.setAttribute(key, `${val}`);\n        });\n        this.yAttrs.forEach(key => {\n            const val = Math.round((clientY - storeVals[key]) / this.zoom.value);\n            element.setAttribute(key, `${val}`);\n        });\n    }\n    onMouseup(element, _clientX, _clientY) {\n        this.attrsStore.delete(element);\n    }\n    getValueAttr(element, key, clientVal) {\n        return Math.round(clientVal - (parseInt(element.getAttribute(key)) || 0) * this.zoom.value);\n    }\n    setValueAttr(element, key, storeValue, clientVal) {\n        const val = Math.round((clientVal - storeValue) / this.zoom.value);\n        element.setAttribute(key, `${val}`);\n    }\n}\nexports.DraggerValue = DraggerValue;\n\n\n//# sourceURL=webpack:///./src/client/src/services/dragger/dragger-value.ts?");

/***/ }),

/***/ "./src/client/src/services/endpoint/index.ts":
/*!***************************************************!*\
  !*** ./src/client/src/services/endpoint/index.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst webview_endpoint_1 = __webpack_require__(/*! ./webview-endpoint */ \"./src/client/src/services/endpoint/webview-endpoint.ts\");\nconst host_api_1 = __webpack_require__(/*! ../host-api */ \"./src/client/src/services/host-api/index.ts\");\nexports.webviewEndpoint = new webview_endpoint_1.WebviewEndpoint(host_api_1.host);\n\n\n//# sourceURL=webpack:///./src/client/src/services/endpoint/index.ts?");

/***/ }),

/***/ "./src/client/src/services/endpoint/webview-endpoint.ts":
/*!**************************************************************!*\
  !*** ./src/client/src/services/endpoint/webview-endpoint.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass WebviewEndpoint {\n    constructor(host) {\n        this.host = host;\n    }\n    createFromPipe(pipe) {\n        return pipe.createEndpoint(fn => {\n            const listener = ({ data }) => fn(data);\n            window.addEventListener('message', listener);\n            return () => window.removeEventListener('message', listener);\n        }, data => this.host.api.postMessage(data));\n    }\n}\nexports.WebviewEndpoint = WebviewEndpoint;\n\n\n//# sourceURL=webpack:///./src/client/src/services/endpoint/webview-endpoint.ts?");

/***/ }),

/***/ "./src/client/src/services/host-api/index.ts":
/*!***************************************************!*\
  !*** ./src/client/src/services/host-api/index.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst vscode_host_1 = __webpack_require__(/*! ./vscode-host */ \"./src/client/src/services/host-api/vscode-host.ts\");\nexports.host = new vscode_host_1.VscodeHost();\n\n\n//# sourceURL=webpack:///./src/client/src/services/host-api/index.ts?");

/***/ }),

/***/ "./src/client/src/services/host-api/vscode-host.ts":
/*!*********************************************************!*\
  !*** ./src/client/src/services/host-api/vscode-host.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass VscodeHost {\n    constructor() {\n        this.vscode = null;\n    }\n    get api() {\n        if (!this.vscode) {\n            this.vscode = acquireVsCodeApi();\n        }\n        return this.vscode;\n    }\n}\nexports.VscodeHost = VscodeHost;\n\n\n//# sourceURL=webpack:///./src/client/src/services/host-api/vscode-host.ts?");

/***/ }),

/***/ "./src/client/src/services/picker/element-holder.ts":
/*!**********************************************************!*\
  !*** ./src/client/src/services/picker/element-holder.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass ElementHolder {\n    constructor() {\n        this.box = Array();\n        this.callbacks = new Set();\n    }\n    get elements() {\n        return this.box;\n    }\n    set elements(val) {\n        this.box = val;\n        this.callbacks.forEach(callback => callback(val));\n    }\n    addListener(callback) {\n        this.callbacks.add(callback);\n        return () => this.callbacks.delete(callback);\n    }\n}\nexports.ElementHolder = ElementHolder;\n\n\n//# sourceURL=webpack:///./src/client/src/services/picker/element-holder.ts?");

/***/ }),

/***/ "./src/client/src/services/picker/index.ts":
/*!*************************************************!*\
  !*** ./src/client/src/services/picker/index.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst element_holder_1 = __webpack_require__(/*! ./element-holder */ \"./src/client/src/services/picker/element-holder.ts\");\nconst picker_1 = __webpack_require__(/*! ./picker */ \"./src/client/src/services/picker/picker.ts\");\nconst artboard_1 = __webpack_require__(/*! ../artboard */ \"./src/client/src/services/artboard/index.ts\");\nconst figures_1 = __webpack_require__(/*! ../../figures */ \"./src/client/src/figures/index.ts\");\nconst host_api_1 = __webpack_require__(/*! ../host-api */ \"./src/client/src/services/host-api/index.ts\");\nconst zoom_1 = __webpack_require__(/*! ../zoom */ \"./src/client/src/services/zoom/index.ts\");\nconst user_event_1 = __webpack_require__(/*! ../user-event */ \"./src/client/src/services/user-event/index.ts\");\nexports.holder = new element_holder_1.ElementHolder();\nexports.picker = new picker_1.Picker(artboard_1.artboard, exports.holder, figures_1.figuresCollection, host_api_1.host, zoom_1.zoom, user_event_1.userEventMan);\n\n\n//# sourceURL=webpack:///./src/client/src/services/picker/index.ts?");

/***/ }),

/***/ "./src/client/src/services/picker/picker.ts":
/*!**************************************************!*\
  !*** ./src/client/src/services/picker/picker.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst set_state_decorator_1 = __webpack_require__(/*! ../../decorators/set-state.decorator */ \"./src/client/src/decorators/set-state.decorator.ts\");\nclass Picker {\n    constructor(artboard, holder, figuresCollection, host, zoom, userEventMan) {\n        this.artboard = artboard;\n        this.holder = holder;\n        this.figuresCollection = figuresCollection;\n        this.host = host;\n        this.zoom = zoom;\n        this.userEventMan = userEventMan;\n        this.mousedownCallbacks = new Set();\n        this.mousemoveCallbacks = new Set();\n        this.mouseupCallbacks = new Set();\n        this.bindedMousedown = this.onMousedown.bind(this);\n        this.bindedMousemove = this.onMousemove.bind(this);\n        this.bindedMouseup = this.onMouseup.bind(this);\n    }\n    /**\n     *\n     * @param event\n     */\n    onMousemove(event) {\n        const { clientX, clientY } = event;\n        this.holder.elements.forEach(element => {\n            this.figuresCollection.delegate(element).drag.onMousemove(element, clientX, clientY);\n        });\n        this.mousemoveCallbacks.forEach(cb => cb(event));\n    }\n    /**\n     *\n     */\n    onMousedown(event) {\n        if (this.userEventMan.mode === 'interactive') {\n            return;\n        }\n        let { target: eventTarget } = event;\n        while (true) {\n            if (eventTarget && eventTarget instanceof SVGElement && eventTarget.parentElement instanceof SVGGElement) {\n                eventTarget = eventTarget.parentElement;\n            }\n            else {\n                break;\n            }\n        }\n        const pickableCtors = this.figuresCollection.getFiltered('drag').map(figure => figure.ctor);\n        if (pickableCtors.some(Ctor => eventTarget instanceof Ctor)) {\n            const target = eventTarget;\n            const { elements } = this.holder;\n            if (event.shiftKey) {\n                if (elements.indexOf(target) === -1) {\n                    this.holder.elements = elements.concat(target);\n                }\n                else {\n                    this.holder.elements = this.holder.elements.filter(el => el !== target);\n                }\n            }\n            else {\n                if (this.holder.elements.indexOf(target) === -1) {\n                    this.holder.elements = [target];\n                }\n                else {\n                    this.holder.elements = elements;\n                }\n            }\n            if (event.altKey) {\n                const outer = target.outerHTML;\n                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');\n                g.innerHTML = outer;\n                const copy = g.children[0];\n                const svg = this.artboard.svg;\n                svg.insertBefore(copy, target);\n            }\n            const { clientX, clientY } = event;\n            this.holder.elements.forEach(element => {\n                this.figuresCollection.delegate(element).drag.onMousedown(element, clientX, clientY);\n            });\n            this.artboard.svg.addEventListener('mousemove', this.bindedMousemove);\n        }\n        else {\n            this.holder.elements = [];\n        }\n        this.mousedownCallbacks.forEach(cb => cb(event));\n    }\n    /**\n     *\n     */\n    onMouseup(event) {\n        const { clientX, clientY } = event;\n        this.holder.elements.forEach(element => {\n            this.figuresCollection.delegate(element).drag.onMouseup(element, clientX, clientY);\n        });\n        this.artboard.svg.removeEventListener('mousemove', this.bindedMousemove);\n        this.mouseupCallbacks.forEach(cb => cb(event));\n    }\n    /**\n     *\n     */\n    listen() {\n        this.artboard.svg.addEventListener('mousedown', this.bindedMousedown);\n        this.artboard.svg.addEventListener('mouseup', this.bindedMouseup);\n    }\n    /**\n     *\n     */\n    addMousemoveCallback(callback) {\n        this.mousemoveCallbacks.add(callback);\n        return () => this.mousemoveCallbacks.delete(callback);\n    }\n    /**\n     *\n     */\n    addMousedownCallback(callback) {\n        this.mousedownCallbacks.add(callback);\n        return () => this.mousedownCallbacks.delete(callback);\n    }\n    /**\n     *\n     */\n    addMouseupCallback(callback) {\n        this.mouseupCallbacks.add(callback);\n        return () => this.mouseupCallbacks.delete(callback);\n    }\n}\n__decorate([\n    set_state_decorator_1.setState\n], Picker.prototype, \"onMouseup\", null);\nexports.Picker = Picker;\n\n\n//# sourceURL=webpack:///./src/client/src/services/picker/picker.ts?");

/***/ }),

/***/ "./src/client/src/services/selection/index.ts":
/*!****************************************************!*\
  !*** ./src/client/src/services/selection/index.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst picker_1 = __webpack_require__(/*! ../picker */ \"./src/client/src/services/picker/index.ts\");\nconst artboard_1 = __webpack_require__(/*! ../artboard */ \"./src/client/src/services/artboard/index.ts\");\nconst selection_1 = __webpack_require__(/*! ./selection */ \"./src/client/src/services/selection/selection.ts\");\nconst zoom_1 = __webpack_require__(/*! ../zoom */ \"./src/client/src/services/zoom/index.ts\");\nexports.selection = new selection_1.UserSelection(picker_1.holder, picker_1.picker, artboard_1.artboard, zoom_1.zoom);\n\n\n//# sourceURL=webpack:///./src/client/src/services/selection/index.ts?");

/***/ }),

/***/ "./src/client/src/services/selection/selection.ts":
/*!********************************************************!*\
  !*** ./src/client/src/services/selection/selection.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass UserSelection {\n    constructor(holder, picker, artboard, zoom) {\n        this.holder = holder;\n        this.picker = picker;\n        this.artboard = artboard;\n        this.zoom = zoom;\n        // private box: HTMLDivElement | null = null;\n        this.svg = null;\n        this.rect = null;\n        this.x = 0;\n        this.y = 0;\n        this.mousedownListener = null;\n        this.mouseupListener = null;\n        this.mousemoveListener = null;\n    }\n    listen() {\n        this.holder.addListener((elements) => {\n            const tools = this.artboard.tools;\n            if (this.svg) {\n                tools.removeChild(this.svg);\n                this.svg = null;\n                this.rect = null;\n            }\n            if (elements.length > 0) {\n                this.svg = self.document.createElementNS('http://www.w3.org/2000/svg', 'svg');\n                this.rect = self.document.createElementNS('http://www.w3.org/2000/svg', 'rect');\n                tools.appendChild(this.svg);\n                this.svg.appendChild(this.rect);\n                this.update();\n                this.mousedownListener = this.picker.addMousedownCallback(({ clientX, clientY }) => {\n                    this.x = clientX;\n                    this.y = clientY;\n                });\n                this.mousemoveListener = this.picker.addMousemoveCallback(({ clientX, clientY }) => {\n                    const dX = clientX - this.x;\n                    const dY = clientY - this.y;\n                    if (this.rect) {\n                        const top = parseInt(this.rect.getAttribute('y'));\n                        const left = parseInt(this.rect.getAttribute('x'));\n                        const newTop = top + dY;\n                        const newLeft = left + dX;\n                        this.rect.setAttribute('y', String(newTop));\n                        this.rect.setAttribute('x', String(newLeft));\n                    }\n                    this.x = clientX;\n                    this.y = clientY;\n                });\n                this.mouseupListener = this.picker.addMouseupCallback(_event => {\n                    this.x = 0;\n                    this.y = 0;\n                    if (this.mousedownListener instanceof Function) {\n                        this.mousedownListener();\n                    }\n                    if (this.mousemoveListener instanceof Function) {\n                        this.mousemoveListener();\n                    }\n                    if (this.mouseupListener instanceof Function) {\n                        this.mouseupListener();\n                    }\n                });\n            }\n        });\n    }\n    update() {\n        const elements = this.holder.elements;\n        if (elements.length > 0) {\n            const boxes = elements.map(el => el.getBoundingClientRect());\n            const left = boxes.map(b => b.left).reduce((akk, left) => left < akk ? left : akk, window.innerWidth);\n            const top = boxes.map(b => b.top).reduce((akk, top) => top < akk ? top : akk, window.innerHeight);\n            const right = boxes.map(b => b.right).reduce((akk, right) => right > akk ? right : akk, 0);\n            const bottom = boxes.map(b => b.bottom).reduce((akk, bottom) => bottom > akk ? bottom : akk, 0);\n            if (this.svg && this.rect) {\n                const { scrollLeft, scrollTop } = document.scrollingElement;\n                const artboardBox = this.artboard.svg.getBoundingClientRect();\n                const artboardWidth = parseInt(this.artboard.svg.getAttribute('width'));\n                const artboardHeight = parseInt(this.artboard.svg.getAttribute('height'));\n                this.svg.setAttribute('width', String(this.zoom.value * artboardWidth));\n                this.svg.setAttribute('height', String(this.zoom.value * artboardHeight));\n                Object.assign(this.svg.style, {\n                    position: 'absolute',\n                    top: artboardBox.top + document.scrollingElement.scrollTop + 'px',\n                    left: artboardBox.left + document.scrollingElement.scrollLeft + 'px',\n                });\n                this.rect.setAttribute('x', String(left - 2 + scrollLeft));\n                this.rect.setAttribute('y', String(top - 2 + scrollTop));\n                this.rect.setAttribute('width', String((right - left + 3)));\n                this.rect.setAttribute('height', String((bottom - top + 3)));\n                this.rect.setAttribute('fill', 'none');\n                this.rect.setAttribute('stroke', '#777');\n                this.rect.setAttribute('stroke-width', '1');\n                this.rect.setAttribute('stroke-dasharray', '1');\n            }\n        }\n        else {\n            this.destroy();\n        }\n    }\n    destroy() {\n        if (this.svg) {\n            const tools = this.artboard.tools;\n            tools.removeChild(this.svg);\n            this.svg = null;\n            this.rect = null;\n        }\n        if (this.mousedownListener instanceof Function) {\n            this.mousedownListener();\n        }\n        if (this.mousemoveListener instanceof Function) {\n            this.mousemoveListener();\n        }\n        if (this.mouseupListener instanceof Function) {\n            this.mouseupListener();\n        }\n    }\n}\nexports.UserSelection = UserSelection;\n\n\n//# sourceURL=webpack:///./src/client/src/services/selection/selection.ts?");

/***/ }),

/***/ "./src/client/src/services/user-event/index.ts":
/*!*****************************************************!*\
  !*** ./src/client/src/services/user-event/index.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst user_event_manager_1 = __webpack_require__(/*! ./user-event-manager */ \"./src/client/src/services/user-event/user-event-manager.ts\");\nexports.userEventMan = new user_event_manager_1.UserEventManager();\n\n\n//# sourceURL=webpack:///./src/client/src/services/user-event/index.ts?");

/***/ }),

/***/ "./src/client/src/services/user-event/user-event-manager.ts":
/*!******************************************************************!*\
  !*** ./src/client/src/services/user-event/user-event-manager.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass UserEventManager {\n    constructor() {\n        this.mode = 'pick';\n    }\n}\nexports.UserEventManager = UserEventManager;\n\n\n//# sourceURL=webpack:///./src/client/src/services/user-event/user-event-manager.ts?");

/***/ }),

/***/ "./src/client/src/services/zoom/index.ts":
/*!***********************************************!*\
  !*** ./src/client/src/services/zoom/index.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst zoom_1 = __webpack_require__(/*! ./zoom */ \"./src/client/src/services/zoom/zoom.ts\");\nconst artboard_1 = __webpack_require__(/*! ../artboard */ \"./src/client/src/services/artboard/index.ts\");\nexports.zoom = new zoom_1.Zoom(artboard_1.artboard);\n\n\n//# sourceURL=webpack:///./src/client/src/services/zoom/index.ts?");

/***/ }),

/***/ "./src/client/src/services/zoom/zoom.ts":
/*!**********************************************!*\
  !*** ./src/client/src/services/zoom/zoom.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass Zoom {\n    constructor(artboard) {\n        this.artboard = artboard;\n        this.zoom = 1;\n        this.callbacks = new Set();\n    }\n    /**\n     * zoom value getter\n     */\n    get value() {\n        return this.zoom;\n    }\n    /**\n     * update zoom value by relative (delta) value or to absolute (abs) value\n     */\n    update(delta, abs) {\n        if (delta) {\n            this.zoom += delta;\n        }\n        if (abs) {\n            this.zoom = abs;\n        }\n        Object.assign(this.artboard.box.style, {\n            transform: `scale(${this.zoom})`,\n        });\n        Object.assign(this.artboard.box.style, {\n            position: `absolute`,\n            top: '0',\n            left: '0',\n        });\n        this.callbacks.forEach(cb => cb(this.value));\n    }\n    /**\n     * add callback, it would be run on zoom value change\n     */\n    addCallback(callback) {\n        this.callbacks.add(callback);\n        return () => this.callbacks.delete(callback);\n    }\n}\nexports.Zoom = Zoom;\n\n\n//# sourceURL=webpack:///./src/client/src/services/zoom/zoom.ts?");

/***/ }),

/***/ "./src/shared/pipes/arrange.pipe.ts":
/*!******************************************!*\
  !*** ./src/shared/pipes/arrange.pipe.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst pipe_1 = __webpack_require__(/*! ../services/pipe/pipe */ \"./src/shared/services/pipe/pipe.ts\");\nexports.arrangePipe = new pipe_1.Pipe('arrange');\n\n\n//# sourceURL=webpack:///./src/shared/pipes/arrange.pipe.ts?");

/***/ }),

/***/ "./src/shared/pipes/artboard.pipe.ts":
/*!*******************************************!*\
  !*** ./src/shared/pipes/artboard.pipe.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst pipe_1 = __webpack_require__(/*! ../services/pipe/pipe */ \"./src/shared/services/pipe/pipe.ts\");\nexports.artboardPipe = new pipe_1.Pipe('artboard');\n\n\n//# sourceURL=webpack:///./src/shared/pipes/artboard.pipe.ts?");

/***/ }),

/***/ "./src/shared/pipes/cancel.pipe.ts":
/*!*****************************************!*\
  !*** ./src/shared/pipes/cancel.pipe.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst pipe_1 = __webpack_require__(/*! ../services/pipe/pipe */ \"./src/shared/services/pipe/pipe.ts\");\nexports.cancelPipe = new pipe_1.Pipe('cancel');\n\n\n//# sourceURL=webpack:///./src/shared/pipes/cancel.pipe.ts?");

/***/ }),

/***/ "./src/shared/pipes/create.pipe.ts":
/*!*****************************************!*\
  !*** ./src/shared/pipes/create.pipe.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst pipe_1 = __webpack_require__(/*! ../services/pipe/pipe */ \"./src/shared/services/pipe/pipe.ts\");\nclass CreatePipeRequest {\n    constructor(elementName, attributes, interactive = false) {\n        this.elementName = elementName;\n        this.attributes = attributes;\n        this.interactive = interactive;\n    }\n}\nexports.CreatePipeRequest = CreatePipeRequest;\nexports.createPipe = new pipe_1.Pipe('create');\n\n\n//# sourceURL=webpack:///./src/shared/pipes/create.pipe.ts?");

/***/ }),

/***/ "./src/shared/pipes/element.pipe.ts":
/*!******************************************!*\
  !*** ./src/shared/pipes/element.pipe.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst pipe_1 = __webpack_require__(/*! ../services/pipe/pipe */ \"./src/shared/services/pipe/pipe.ts\");\nexports.elementPipe = new pipe_1.Pipe('element');\n\n\n//# sourceURL=webpack:///./src/shared/pipes/element.pipe.ts?");

/***/ }),

/***/ "./src/shared/pipes/flush.pipe.ts":
/*!****************************************!*\
  !*** ./src/shared/pipes/flush.pipe.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst pipe_1 = __webpack_require__(/*! ../services/pipe/pipe */ \"./src/shared/services/pipe/pipe.ts\");\nexports.flushPipe = new pipe_1.Pipe('flush');\n\n\n//# sourceURL=webpack:///./src/shared/pipes/flush.pipe.ts?");

/***/ }),

/***/ "./src/shared/pipes/group.pipe.ts":
/*!****************************************!*\
  !*** ./src/shared/pipes/group.pipe.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst pipe_1 = __webpack_require__(/*! ../services/pipe/pipe */ \"./src/shared/services/pipe/pipe.ts\");\nexports.groupPipe = new pipe_1.Pipe('group');\n\n\n//# sourceURL=webpack:///./src/shared/pipes/group.pipe.ts?");

/***/ }),

/***/ "./src/shared/pipes/pick.pipe.ts":
/*!***************************************!*\
  !*** ./src/shared/pipes/pick.pipe.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst pipe_1 = __webpack_require__(/*! ../services/pipe/pipe */ \"./src/shared/services/pipe/pipe.ts\");\nexports.pickPipe = new pipe_1.Pipe('pick');\n\n\n//# sourceURL=webpack:///./src/shared/pipes/pick.pipe.ts?");

/***/ }),

/***/ "./src/shared/pipes/remote-attribute.pipe.ts":
/*!***************************************************!*\
  !*** ./src/shared/pipes/remote-attribute.pipe.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst pipe_1 = __webpack_require__(/*! ../services/pipe/pipe */ \"./src/shared/services/pipe/pipe.ts\");\nexports.remoteAttributePipe = new pipe_1.Pipe('remoteAttribute');\n\n\n//# sourceURL=webpack:///./src/shared/pipes/remote-attribute.pipe.ts?");

/***/ }),

/***/ "./src/shared/pipes/zoom.pipe.ts":
/*!***************************************!*\
  !*** ./src/shared/pipes/zoom.pipe.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst pipe_1 = __webpack_require__(/*! ../services/pipe/pipe */ \"./src/shared/services/pipe/pipe.ts\");\nexports.zoomPipe = new pipe_1.Pipe('zoom');\n\n\n//# sourceURL=webpack:///./src/shared/pipes/zoom.pipe.ts?");

/***/ }),

/***/ "./src/shared/services/pipe/pipe.ts":
/*!******************************************!*\
  !*** ./src/shared/services/pipe/pipe.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * Pipe endpoint\n */\nclass PipeEndpoint {\n    constructor(tag, listenerFn, senderFn) {\n        this.tag = tag;\n        this.listenerFn = listenerFn;\n        this.senderFn = senderFn;\n        this.listeners = new Array();\n        this.requestGuard = (data) => {\n            return typeof data === 'object' && data !== null && this.tag in data;\n        };\n        this.responseGuard = (data) => {\n            return typeof data === 'object' && data !== null && this.tag in data;\n        };\n    }\n    /**\n     * Make get request\n     */\n    makeGetRequest(request) {\n        return new Promise((resolve) => {\n            const listener = this.listenerFn((data) => {\n                if (this.responseGuard(data)) {\n                    listener();\n                    resolve(data[this.tag]['response']);\n                }\n            });\n            const payload = { [this.tag]: { get: request } };\n            this.senderFn(payload);\n        });\n    }\n    /**\n     * Make set request\n     */\n    makeSetRequest(request) {\n        const payload = { [this.tag]: { set: request } };\n        this.senderFn(payload);\n    }\n    /**\n     * Listen to get requests\n     */\n    listenGetRequest(preconditionFn, makeResponseFn) {\n        const listener = this.listenerFn((data) => {\n            if (this.requestGuard(data) && data[this.tag].get) {\n                const request = data[this.tag].get;\n                const extra = preconditionFn(request);\n                if (extra) {\n                    const response = makeResponseFn(request, extra);\n                    const payload = { [this.tag]: { 'response': response } };\n                    this.senderFn(payload);\n                }\n            }\n        });\n        this.listeners.push(listener);\n    }\n    /**\n     * Listen to set requests\n     */\n    listenSetRequest(preconditionFn, applicationFn) {\n        const listener = this.listenerFn((data) => {\n            if (this.requestGuard(data) && data[this.tag].set) {\n                const request = data[this.tag].set;\n                const extra = preconditionFn(request);\n                if (extra) {\n                    applicationFn(request, extra);\n                }\n            }\n        });\n        this.listeners.push(listener);\n    }\n    /**\n     * Stop listening\n     */\n    removeListeners() {\n        this.listeners.forEach(listener => listener());\n        this.listeners.length = 0;\n    }\n}\nexports.PipeEndpoint = PipeEndpoint;\n/**\n * Pipe\n */\nclass Pipe {\n    constructor(tag) {\n        this.tag = tag;\n    }\n    createEndpoint(listenerFn, senderFn) {\n        return new PipeEndpoint(this.tag, listenerFn, senderFn);\n    }\n    createListenerEndpoint(listenerFn) {\n        return new PipeEndpoint(this.tag, listenerFn, () => { });\n    }\n    createSenderEndpoint(posterFn) {\n        return new PipeEndpoint(this.tag, () => () => { }, posterFn);\n    }\n}\nexports.Pipe = Pipe;\n\n\n//# sourceURL=webpack:///./src/shared/services/pipe/pipe.ts?");

/***/ })

/******/ });