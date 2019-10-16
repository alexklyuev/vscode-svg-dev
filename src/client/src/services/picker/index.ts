import { ElementHolder } from "./element-holder";
import { Picker } from "./picker";
import { figuresCollection } from "../../figures";
import { zoom } from "../zoom";


export const holder = new ElementHolder();
export const picker = new Picker(holder, figuresCollection, zoom);
