export const setDeviceGuidCookie = () => {
    const cookieArr = document.cookie.split(";");
    let flag = true;
    let guid: string = "";
    for (let i = 0; i < cookieArr.length; i++) {
        const cookiePair = cookieArr[i].split("=");
        if ("device_guid" == cookiePair[0].trim()) {
            flag = false;
            guid = cookiePair[1];
        }
    }
    if (flag) {
        guid = self.crypto.randomUUID();
        document.cookie = `device_guid=${guid}; path = /; max-age=${365 * 24 * 60 * 60}`;
    }
    return guid;
};
