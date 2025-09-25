async function openBrowser() {
    try {
        let fetchedKey = await fetch("/syn/browser-key", { method: "POST" });
        if (fetchedKey.status === 403) {
            const csrfToken = keyRes.headers.get("x-csrf-token");
            keyRes = await fetch("/syn/browser-key", {
                method: "POST",
                headers: { "x-csrf-token": csrfToken }
            });
        }
        const key = (await keyRes.json()).key;

        const browserRes = await fetch(`/syn/browser?key=${key}&url=`);
        if (!browserRes.ok) 
            throw new Error("Invalid or expired key");

        const browserUrl = (await browserRes.json()).url;
        window.location.replace(browserUrl)
    } catch (err) {
        console.error("Failed to open browser:", err);
    }
}

openBrowser();
