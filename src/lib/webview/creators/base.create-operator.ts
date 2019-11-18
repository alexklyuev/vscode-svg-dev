import { CreateOperator } from "../models/operators/create-operator.model";
import { spawner } from "@/dom/spawner";
import { setState } from "&resolve/decorators/set-state.decorator";


export abstract class BaseCreateOperator implements CreateOperator {

    @setState
    async create(_name: string, attributes: {[K: string]: string}) {
        const element = await this.makeElement();
        if (element instanceof SVGElement) {
            spawner.svg.update(element, attributes);
        }
    }

    abstract makeElement(): Promise<any>;

}
