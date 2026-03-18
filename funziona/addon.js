const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const fetch = require("node-fetch");

const BASE = "https://tvvoo.hayd.uk/cfg-it";

const manifest = {
    id: "org.roby.proxy.tvvoo",
    version: "1.0.0",
    name: "Roby TVVoo Proxy",
    description: "Proxy personalizzato dell'addon TVVoo",
    catalogs: [
        { type: "tv", id: "tvvoo-proxy", name: "TVVoo Proxy" }
    ],
    resources: ["catalog", "stream", "meta"],
    types: ["movie", "series", "tv"],
    idPrefixes: ["tt", "tvvoo"]
};

const builder = new addonBuilder(manifest);

// 1️⃣ Catalogo
builder.defineCatalogHandler(async (args) => {
    return {
        metas: [
            {
                id: "sportuno",
                type: "tv",
                name: "Sky Sport Uno (TEST)",
                poster: "https://raw.githubusercontent.com/blvckroby/provaTV/main/skyf1.jpg"
            }
        ]
    }
});

// 2️⃣ Stream
builder.defineStreamHandler(async (args) => {
    try {
        const url = `${BASE}/stream/${args.type}/${args.id}.json`;
        const res = await fetch(url);
        return await res.json();
    } catch (err) {
        console.error("Errore stream:", err);
        return { streams: [] };
    }
});

// 3️⃣ Meta
builder.defineMetaHandler(async (args) => {
    try {
        const url = `${BASE}/meta/${args.type}/${args.id}.json`;
        const res = await fetch(url);
        return await res.json();
    } catch (err) {
        console.error("Errore meta:", err);
        return { meta: {} };
    }
});

// 4️⃣ Avvio server
serveHTTP(builder.getInterface(), { port: 7000 });
