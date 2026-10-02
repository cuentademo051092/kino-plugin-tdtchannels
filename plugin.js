const TV_JSON = "https://www.tdtchannels.com/lists/tv.json";

function makeRef(c, i) {
  return encodeURIComponent(JSON.stringify({
    name:c.name, logo:c.logo||null, web:c.web||null, epg_id:c.epg_id||null,
    country:c.country||null, ambit:c.ambit||null, optionIndex:i
  }));
}

function parseRef(ref) {
  try { return JSON.parse(decodeURIComponent(ref)); }
  catch (_) { throw new Error("tdtchannels: referencia de canal inválida"); }
}

async function loadCatalog() {
  const r = await kino.fetch(TV_JSON);
  if (!r.ok) throw new Error("tdtchannels: error cargando TV JSON (HTTP " + r.status + ")");
  const data = await r.json(), channels = [];
  for (const country of (Array.isArray(data.countries) ? data.countries : []))
    for (const ambit of (Array.isArray(country.ambits) ? country.ambits : []))
      for (const channel of (Array.isArray(ambit.channels) ? ambit.channels : []))
        channels.push({...channel, country:country.name, ambit:ambit.name});
  return channels;
}

function playableOptions(c) {
  return (Array.isArray(c.options) ? c.options : [])
    .map((option,index)=>({option,index}))
    .filter(x => x.option && typeof x.option.url==="string" &&
      x.option.url.length>0 && x.option.format==="m3u8");
}

export async function search(query) {
  const q = String(query?.q||"").trim().toLowerCase();
  const channels = await loadCatalog(), results = [];
  for (const c of channels) {
    const opts = playableOptions(c);
    if (!opts.length) continue;
    const haystack = [c.name||"",c.country||"",c.ambit||"",
      ...(Array.isArray(c.extra_info)?c.extra_info:[])].join(" ").toLowerCase();
    if (q && !haystack.includes(q)) continue;
    const selected = opts[0];
    results.push({
      id:"tdt-"+encodeURIComponent([c.country,c.ambit,c.name].join("-")),
      ref:makeRef(c,selected.index), title:c.name, kind:"movie",
      poster:c.logo||undefined, backdrop:c.logo||undefined
    });
  }
  return results;
}

export async function episodes() { return {episodes:[]}; }

export async function resolve(ref) {
  const item = parseRef(ref), channels = await loadCatalog();
  const c = channels.find(x => x.name===item.name &&
    x.country===item.country && x.ambit===item.ambit);
  if (!c) throw new Error("tdtchannels: canal no encontrado");
  const opts = playableOptions(c);
  const selected = opts.find(x=>x.index===item.optionIndex)||opts[0];
  if (!selected) throw new Error("tdtchannels: no hay fuente M3U8 disponible para este canal");
  return {url:selected.option.url, mime:"application/x-mpegURL"};
}
