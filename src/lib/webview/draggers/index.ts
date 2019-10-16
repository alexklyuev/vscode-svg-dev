import { DraggerValue } from "@/webview/draggers/dragger-value";
import { DraggerPoints } from "@/webview/draggers/dragger-points";
import { DraggerDelegate } from "@/webview/draggers/dragger-delegate";
import { DraggerPath } from "@/webview/draggers/dragger-path";


export const draggerLeftTop = new DraggerValue(['x'], ['y']);
export const draggerCenter = new DraggerValue(['cx'], ['cy']);
export const draggerDouble = new DraggerValue(['x1', 'x2'], ['y1', 'y2']);
export const draggerPoints = new DraggerPoints();
export const draggerDelegate = new DraggerDelegate();
export const draggerPath = new DraggerPath();
