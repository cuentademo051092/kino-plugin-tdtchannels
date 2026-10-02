// TDTChannels para Kino - v0.2.2
// Basado en la versión estable v0.2.0.
// Personalización mediante hideGroups: Kino descarga y analiza la M3U,
// pero oculta las categorías que no queremos mostrar.

const PLAYLIST = "https://www.tdtchannels.com/lists/tv.m3u8";
const EPG = "https://www.tdtchannels.com/epg/TV.xml.gz";

// Solo se muestran estas categorías:
// Generalistas, Informativos, Deportivos, Infantiles, Eventuales,
// Int. América, Int. Otros, Deportivos Int., Musicales y Religiosos.
//
// Kino aplica hideGroups al agrupar la M3U. No tocamos la reproducción
// ni convertimos los canales a otro formato.

const HIDDEN_GROUPS = [
  "Streaming",
  "Autonómicos",
  "Andalucía",
  "Aragón",
  "Asturias",
  "P. de Asturias",
  "Cantabria",
  "Castilla-La Mancha",
  "Castilla y León",
  "Cataluña",
  "Ceuta",
  "Comunidad de Madrid",
  "Comunitat Valenciana",
  "Comunidad Valenciana",
  "Extremadura",
  "Galicia",
  "Illes Balears",
  "Islas Baleares",
  "Islas Canarias",
  "La Rioja",
  "Melilla",
  "Navarra",
  "País Vasco",
  "R. de Murcia",
  "Int. Europa",
  "Int. Asia",
  "Int. África",
  "Canarias",
  "C. Madrid",
  "C. Foral de Navarra",
  "C. Valenciana"
];

export async function home() {
  return [];
}

export async function liveCategories() {
  return [{
    playlist: {
      url: PLAYLIST,
      format: "m3u",
      epg: { url: EPG, format: "xmltv" },
      refreshHours: 6,
      hideGroups: HIDDEN_GROUPS
    }
  }];
}

export async function liveChannels() {
  return { items: [] };
}

export async function resolve() {
  await null;
  throw kino.error("not_found");
}
