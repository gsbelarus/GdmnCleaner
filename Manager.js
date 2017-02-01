export async function postJSON() {
    let response = await fetch("http://192.168.0.54:3000/?token=garbit&barcode=10167&lngn=1.1&latn=2.2", {
        method: 'get'
    });

    let responseStatus = await response.status;
    if (responseStatus >= 200 && responseStatus < 300) return await response.json();
    if (responseStatus == 400) throw new Error("Bad Request.");
    if (responseStatus == 501) throw new Error("Not implemented on server yet.");
}