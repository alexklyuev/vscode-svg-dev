import { cancelProducer } from "@/webapp/producers";


export const activateKeyboardShortcuts = () => {

    window.addEventListener('keyup', event => {
        const { key } = event;
        if (key === 'Escape') {
            cancelProducer.makeSetRequest('escape');
        }
        if (key === 'Enter') {
            cancelProducer.makeSetRequest('enter');
        }
    });

};
