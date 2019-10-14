import { EditPointsHub } from "./edit-points-hub";
import { cancelListener } from "../../../../client/src/listeners";

export const editPointsHub = new EditPointsHub(cancelListener);
