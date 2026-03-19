export const zoneTheme = {
  kids: {
    chip: "border-pink-300/40 bg-pink-300/10 text-pink-200",
    cardAccent: "border-pink-300/30",
    label: "Kids Zone",
    emoji: "🧒",
  },
  teen: {
    chip: "border-cyan-300/40 bg-cyan-300/10 text-cyan-200",
    cardAccent: "border-cyan-300/30",
    label: "Teen Zone",
    emoji: "🧑",
  },
  adult: {
    chip: "border-violet-300/40 bg-violet-300/10 text-violet-200",
    cardAccent: "border-violet-300/30",
    label: "Adult Zone",
    emoji: "🎓",
  },
};

export function getZoneTheme(zone) {
  return zoneTheme[zone] || zoneTheme.teen;
}
