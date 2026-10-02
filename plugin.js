// TDTChannels para Kino - v0.2.0
// Usa apiVersion 3 + channels y una lista M3U pública.

const PLAYLIST = "https://www.tdtchannels.com/lists/tv.m3u8";
const EPG = "https://www.tdtchannels.com/epg/TV.xml.gz";

export async function home() {
  return [];
}

export async function liveCategories() {
  return [{
    playlist: {
      url: PLAYLIST,
      format: "m3u",
      epg: { url: EPG, format: "xmltv" },
      refreshHours: 6
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
