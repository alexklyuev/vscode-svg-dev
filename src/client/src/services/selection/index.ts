import { holder, picker } from "../picker";
import { artboard } from "../artboard";
import { UserSelection } from "./selection";
import { zoom } from "../zoom";

export const selection = new UserSelection(holder, picker, artboard, zoom);