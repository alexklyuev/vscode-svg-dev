import { cancelProducer, elementProducer } from "@/webapp/producers";


export const activateKeyboardShortcuts = () => {

    window.addEventListener('keydown', event => {
        const { key } = event;
        if (key === 'Escape') {
            cancelProducer.makeSetRequest('escape');
        }
        if (key === 'Enter') {
            cancelProducer.makeSetRequest('enter');
        }
        if (key === 'Backspace') {
            elementProducer.makeSetRequest('delete');
        }
    });

};
