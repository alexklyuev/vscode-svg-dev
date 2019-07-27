import { ArtboardControls } from "./artboard.controls";
import { FillControl } from "./fill.control";
import { StrokeControl } from "./stroke.control";
import { ShapesOutlet } from "./shapes.outlet";
import { EditPointsControl } from "./edit-points.control";
import { GroupControls } from "./group.controls";

export class AppearanceOutlet {

    private aprOutletEl: HTMLElement;

    constructor(
        public readonly artboardControls: ArtboardControls,
        public readonly fillControl: FillControl,
        public readonly strokeControl: StrokeControl,
        public readonly shapesOutlet: ShapesOutlet,
        public readonly groupControls: GroupControls,
        public readonly editPointsControl: EditPointsControl,
    ) {
        this.aprOutletEl = document.createElement('div');
        Object.assign(this.aprOutletEl.style, {
            'margin-top': '10px',
            'margin-left': '10px',
        });
        this.artboardControls.appendTo(this.aprOutletEl);
        this.fillControl.appendTo(this.aprOutletEl);
        this.strokeControl.appendTo(this.aprOutletEl);
        this.shapesOutlet.appendTo(this.aprOutletEl);
        this.groupControls.appendTo(this.aprOutletEl);
        this.editPointsControl.appendTo(this.aprOutletEl);
    }

    appendTo(parentElement: HTMLElement) {
        parentElement.appendChild(this.aprOutletEl);
    }

}
