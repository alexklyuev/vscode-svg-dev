import { FlushListener } from "./flush.listener";
import { flushPipe } from "@/shared/pipes/flush.pipe";


export const flushListener = new FlushListener(flushPipe);
flushListener.listen();
