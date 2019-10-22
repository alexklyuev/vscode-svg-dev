/**
 * css and js string property names converter
 */
export class CssJsNotationConverter {

    /**
     * 'directive-name' -> 'directiveName'
     */
    fromCssToJsNotation(cssString: string): string {
        return cssString.replace(/-\w/g, substr => {
            return String.fromCharCode(substr.charCodeAt(1) - 32);
        });
    }

    /**
     * 'directiveName' -> 'directive-name'
     */
    fromJsToCssNotation(jsString: string): string {
        let cssString = '';
        for (let char of jsString) {
            const code = char.charCodeAt(0);
            if (code <= 90) {
                cssString += '-' + String.fromCharCode(code + 32);
            } else {
                cssString += char;
            }
        }
        return cssString;
    }

}
