import { CancelHub } from "./cancel-hub";
import { cancelListener } from "../../listeners";

export const cancelHub = new CancelHub(cancelListener);
