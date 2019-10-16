import { appearance } from "@/webview/services/appearance";

import { Hud } from "./hud";
import { ColorRepresenterService } from "./color-representer.service";
import { AppearanceOutlet } from "./appearance.outlet";
import { ArtboardControls } from "./artboard.controls";
import { FillControl } from "./fill.control";
import { StrokeControl } from "./stroke.control";
import { artboardStyleListener, artboardListener } from "../../listeners";
import { artboardInverseEndpoint } from "../../producers/artboard-inverse.producer";
import { artboardStyleInverseProducer } from "../../producers/artboard-style-inverse.producer";
import { appearanceEndpoint } from "../../producers/appearance.producer";
import { ShapesOutlet } from "./shapes.outlet";
import { pathShape, polygonShape, polylineShape, rectShape, circleShape, ellipseShape, textShape, lineShape } from "./shapes";
import { EditPointsControl } from "./edit-points.control";
import { GroupControls } from "./group.controls";
import { EditOnPick } from "./edit-on-pick.control";

export const colorRepresenter = new ColorRepresenterService();
export const artboardControls = new ArtboardControls(
  artboardStyleListener,
  artboardStyleInverseProducer,
  colorRepresenter,
  artboardListener,
  artboardInverseEndpoint,
);
export const fillControl = new FillControl(
  appearance,
  colorRepresenter,
  appearanceEndpoint,
);
export const strokeControl = new StrokeControl(
  appearance,
  colorRepresenter,
  appearanceEndpoint,
);
export const shapesOutlet = new ShapesOutlet(
  pathShape,
  polygonShape,
  polylineShape,
  lineShape,
  rectShape,
  circleShape,
  ellipseShape,
  textShape,
);
export const groupControls = new GroupControls();
export const editPointsControl = new EditPointsControl();
export const editOnPick = new EditOnPick();
export const firstRowOutlet = new AppearanceOutlet(
  artboardControls,
  fillControl,
  strokeControl,
  shapesOutlet,
  groupControls,
);
export const secondRowOutlet = new AppearanceOutlet(
    editOnPick,
    editPointsControl,
);

export const hud = new Hud(
  firstRowOutlet,
  secondRowOutlet,
);
