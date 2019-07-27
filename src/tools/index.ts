import { Toolbox } from "../services/toobox";
import { ToolGroup } from "../entities/tool-group";
import { NewDocument } from "./document/new.tool";
import { FlushTool } from "./document/flush.tool";
import { DeleteTool } from "./element/delete.tool";
import { IdTool } from "./element/id.tool";
import { TransformTool } from "./element/transform.tool";
import { GroupTool } from "./group/group.tool";
import { UngroupTool } from "./group/ungroup.tool";
import { CircleAdd } from "./circle/circle-add.tool";
import { CircleRadiusTool } from "./circle/circle-radius.tool";
import { AddEllipseTool } from "./ellipse/add-ellipse.tool";
import { EllipseRxTool } from "./ellipse/rx.tool";
import { EllipseRyTool } from "./ellipse/ry.tool";
import { RectAddTool } from "./rect/rect-add.tool";
import { RectWidthTool } from "./rect/rect-width.tool";
import { RectHeightTool } from "./rect/rect-height.tool";
import { RectRxTool } from "./rect/rect-rx.tool";
import { RectRyTool } from "./rect/rect-ry.tool";
import { DefaultZoom } from "./zoom/default-zoom.tool";
import { ZoomIn } from "./zoom/zoom-in.tool";
import { ZoomOut } from "./zoom/zoom-out.tool";
import { ArtboardWidth } from "./document/artboard-width.tool";
import { ArtboardHeight } from "./document/artboard-height.tool";
import { Fill } from "./color/fill.tool";
import { Stroke } from "./color/stroke.tool";
import { StrokeWidth } from "./stroke/stroke-width.tool";
import { StrokeDasharray } from "./stroke/stroke-dasharray.tool";
import { PathAddTool } from "./path/path-add.tool";
import { PathEditTool } from "./path/path-edit-points.tool";
import { PathEditInteractive } from "./path/path-edit-interactive.tool";
import { StrokeLinecap } from "./stroke/stroke-linecap.tool";
import { StrokeLinejoin } from "./stroke/stroke-linejoin.tool";
import { CopyInPlaceTool } from "./element/copy-in-place.tool";
import { CopyTool } from "./element/copy.tool";
import { ListAttributesTool } from "./attributes/list-attributes.tool";
import { AddAttributeTool } from "./attributes/add-attribute.tool";

export const toolbox = new Toolbox();

toolbox.register(
    new ToolGroup('Document'),
    new NewDocument(),
    new FlushTool(),
    // {command: {title: 'Artboard move on', command: 'svgDevArtboardMoveOn'}},
    // {command: {title: 'Artboard move off', command: 'svgDevArtboardMoveOff'}},
);
toolbox.register(
    new ToolGroup('Element'),
    new CopyTool(),
    new CopyInPlaceTool(),
    new DeleteTool(),
    new IdTool(),
    new TransformTool(),
);
toolbox.register(
    new ToolGroup('Attributes'),
    new AddAttributeTool(),
    new ListAttributesTool(),
);
toolbox.register(
    new ToolGroup('Group'),
    new GroupTool(),
    new UngroupTool(),
);
toolbox.register(
    new ToolGroup('Circle'),
    new CircleAdd(),
    new CircleRadiusTool(),
);
toolbox.register(
    new ToolGroup('Ellipse'),
    new AddEllipseTool(),
    new EllipseRxTool(),
    new EllipseRyTool(),
);
toolbox.register(
    new ToolGroup('Rect'),
    new RectAddTool(),
    new RectWidthTool(),
    new RectHeightTool(),
    new RectRxTool(),
    new RectRyTool(),
);
toolbox.register(
    new ToolGroup('Line'),
    {command: {title: 'Add Line', command: 'svgDevAddInteractive', arguments: ['line']}},
    {command: {title: 'X1', command: 'svgDevRemoteAttributeInput', arguments: ['x1']}},
    {command: {title: 'Y1', command: 'svgDevRemoteAttributeInput', arguments: ['y1']}},
    {command: {title: 'X2', command: 'svgDevRemoteAttributeInput', arguments: ['x2']}},
    {command: {title: 'Y2', command: 'svgDevRemoteAttributeInput', arguments: ['y2']}},
    {command: {title: 'Edit points visually', command: 'svgDevEdit'}},
);
toolbox.register(
    new ToolGroup('Poly'),
    {command: {title: 'Add Polygon', command: 'svgDevAddInteractive', arguments: ['polygon']}},
    {command: {title: 'Add Polyline', command: 'svgDevAddInteractive', arguments: ['polyline']}},
    {command: {title: 'Edit points attribute', command: 'svgDevRemoteAttributeInput', arguments: ['points']}},
    {command: {title: 'Edit points visually', command: 'svgDevEdit'}},
);
toolbox.register(
    new ToolGroup('Path'),
    new PathAddTool(),
    new PathEditTool(),
    new PathEditInteractive(),
);
toolbox.register(
    new ToolGroup('Text'),
    {command: {title: 'Add', command: 'svgDevAddText'}},
    {command: {title: 'Edit', command: 'svgDevRemoteAttributeInput', arguments: ['innerText']}},
    {command: {title: 'Font size', command: 'svgDevRemoteAttributeInput', arguments: ['font-size']}},
    {command: {title: 'Font family', command: 'svgDevRemoteAttributeInput', arguments: ['font-family']}},
);
toolbox.register(
    new ToolGroup('Zoom'),
    new DefaultZoom(),
    new ZoomIn(),
    new ZoomOut(),
    {command: {title: 'Set value', command: 'svgDevZoom'}},
);
toolbox.register(
    new ToolGroup('Artboard'),
    new ArtboardWidth(),
    new ArtboardHeight(),
    {command: {title: 'Viewbox', command: 'svgDevArtboardViewBox'}},
    {command: {title: 'Background', command: 'svgDevArtboardStyleBackground'}},
    {command: {title: 'Any style', command: 'svgDevArtboardStyleAdd'}},
);
toolbox.register(
    new ToolGroup('Color'), 
    new Fill(), 
    new Stroke(),
);
toolbox.register(
    new ToolGroup('Stroke'),
    new StrokeWidth(),
    new StrokeDasharray(),
    new StrokeLinecap(),
    new StrokeLinejoin(),
);
toolbox.register(
    new ToolGroup('Order'),
    {command: {title: 'Bring to front', command: 'svgDevArrange', arguments: ['bringToFront']}},
    {command: {title: 'Send to back', command: 'svgDevArrange', arguments: ['sendToBack']}},
    {command: {title: 'Move forward', command: 'svgDevArrange', arguments: ['moveForward']}},
    {command: {title: 'Move backward', command: 'svgDevArrange', arguments: ['moveBackward']}},
);
toolbox.register(
    new ToolGroup('Style'),
    {command: {title: 'Add', command: 'svgDevStyleAdd'}},
    {command: {title: 'Remove', command: 'svgDevStyleRemove'}},
    {command: {title: 'Edit', command: 'svgDevStyleEdit'}},
);
