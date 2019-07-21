export class ColorRepresenterService {

    representColorButtonBackground(color: string): string {
        switch (color) {
            case '':
            case 'none':
            case undefined:
            case null:
                return `rgba(0,0,0,0)`;
            default:
                return color;
        }
    }

    representColorButtonBorder(color: string): string {
        switch (color) {
            case '':
            case 'none':
            case undefined:
            case null:
                return `1px dashed white`;
            default:
                return `1px solid white`;
        }
    }

}
