import { hostEndpoint } from "@/webapp/host-endpoint";
import { cancelPipe } from "@/shared/pipes/cancel.pipe";
import { editPipe } from "@/shared/pipes/edit.pipe";


export const cancelProducer = hostEndpoint.createFromPipe(cancelPipe);
export const editProducer = hostEndpoint.createFromPipe(editPipe);

export const producers = {
    cancelProducer,
    editProducer,
};
