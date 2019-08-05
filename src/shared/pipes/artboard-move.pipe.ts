import { Pipe } from "../../lib/common/pipe/pipe";
import { PipeTags } from "./tags";


export const artboardMovePipe = new Pipe<boolean, boolean, PipeTags.artboardMove>(PipeTags.artboardMove);
