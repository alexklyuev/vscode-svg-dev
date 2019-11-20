import { hostEndpoint } from "@/webapp/host-endpoint";
import { cancelPipe } from "@/shared/pipes/cancel.pipe";
import { editPipe } from "@/shared/pipes/edit.pipe";
import { elementPipe } from "@/shared/pipes/element.pipe";


export const cancelProducer = hostEndpoint.createFromPipe(cancelPipe);
export const editProducer = hostEndpoint.createFromPipe(editPipe);
export const elementProducer = hostEndpoint.createFromPipe(elementPipe);

export const producers = {
    cancelProducer,
    editProducer,
};
