import Cockpit from "$lib/api/cockpit.js";
import { cockpitOrgin } from "$lib/shared/host.js";

export async function get() {

    const cockpit = new Cockpit({ host: cockpitOrgin, token: "74cbd466156296523850841132baa4" });

    let body = '{"message": "nah you slut"}';

    await cockpit.fetchDataText("/api/collections/get/potss", { method: "GET" }, { populate: "1" }).then((entries) => {
        body = entries;
    }).catch(e => {
        return {
            status: 500,
            body: "eeeh"
        }
    });

    return {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    };
}
