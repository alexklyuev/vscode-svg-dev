import { ElementHolder } from "./element-holder";
import { Picker } from "./picker";
import { artboard } from "../artboard";
import { figuresCollection } from "../../figures";
import { host } from "../host-api";
import { zoom } from "../zoom";
import { userEventMan } from "../user-event";


export const holder = new ElementHolder();
export const picker = new Picker(artboard, holder, figuresCollection, host, zoom, userEventMan);
