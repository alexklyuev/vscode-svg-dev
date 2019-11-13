import { app } from "@/web/init";


window.addEventListener('load', onLoad);

function onLoad(this: void, _event: Event) {
    document.body.appendChild(app);
}
