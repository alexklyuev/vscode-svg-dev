import { app } from "@/webapp/init";


window.addEventListener('load', onLoad);

function onLoad(this: void, _event: Event) {
    document.body.appendChild(app);
}
