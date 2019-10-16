import { Spawn, HtmlSpawner, SvgSpawner } from "./spawn";

export const spawner = new Spawn(new HtmlSpawner(), new SvgSpawner());
