import { Spawn, HtmlSpawner, SvgSpawner } from "./spawn";

export const spawn = new Spawn(new HtmlSpawner(), new SvgSpawner());
