// TDTChannels para Kino - v0.2.1
// Filtra la lista JSON oficial de TDTChannels y conserva únicamente
// las categorías seleccionadas por el usuario.

const SOURCE = "https://www.tdtchannels.com/lists/tv.json";

const ALLOWED_CATEGORIES = [
  "Generalistas",
  "Informativos",
  "Deportivos",
  "Infantiles",
  "Eventuales",
  "Int. América",
  "Int. Otros",
  "Deportivos Int.",
  "Musicales",
  "Religiosos"
];

function idForCategory(name) {
  return "tdt-" + name.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function firstPlayableOption(channel) {
  if (!channel || !Array.isArray(channel.options)) return null;
  for (const option of channel.options) {
    if (!option || typeof option.url !== "string") continue;
    if (option.format === "m3u8") return option;
  }
  return null;
}

async function loadSource() {
  const response = await kino.fetch(SOURCE, { timeoutMs: 15000 });
  if (!response.ok) throw kino.error("network", "No se pudo cargar TDTChannels");
  return response.json();
}

export async function home() {
  return [];
}

export async function liveCategories() {
  const data = await loadSource();
  const categories = [];

  for (const country of (data.countries || [])) {
    for (const ambit of (country.ambits || [])) {
      if (!ALLOWED_CATEGORIES.includes(ambit.name)) continue;
      categories.push({
        id: idForCategory(ambit.name),
        name: ambit.name
      });
    }
  }

  return categories;
}

export async function liveChannels() {
  const data = await loadSource();
  const items = [];

  for (const country of (data.countries || [])) {
    for (const ambit of (country.ambits || [])) {
      if (!ALLOWED_CATEGORIES.includes(ambit.name)) continue;

      const categoryId = idForCategory(ambit.name);

      for (const channel of (ambit.channels || [])) {
        const option = firstPlayableOption(channel);
        if (!option) continue;

        items.push({
          id: categoryId + "-" + String(channel.epg_id || channel.name),
          name: channel.name,
          categoryId,
          logoUrl: channel.logo || null,
          stream: {
            url: option.url
          }
        });
      }
    }
  }

  return { items };
}

export async function resolve() {
  await null;
  throw kino.error("not_found");
}
