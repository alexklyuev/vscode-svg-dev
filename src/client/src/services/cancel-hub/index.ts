import { EditPointsHub } from "./cancel-hub";
import { cancelListener } from "../../listeners";

export const editPointsHub = new EditPointsHub(cancelListener);
