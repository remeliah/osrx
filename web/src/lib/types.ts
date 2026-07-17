export interface ModInfo {
  acronym: string;
  settings?: Record<string, unknown>;
}

export interface ScoreInfo {
  mods: ModInfo[];
}

export interface ReplayDto {
  play_mode: number;
  osu_version: number;
  beatmap_md5: string;
  username: string;
  replay_md5: string;
  count_300: number;
  count_100: number;
  count_50: number;
  count_geki: number;
  count_katu: number;
  count_miss: number;
  score: number;
  max_combo: number;
  fullcombo: boolean;
  mods: number;
  timestamp: string;
  online_id: number;
  raw_b64: string;
  score_info?: ScoreInfo;
}

export const PLAY_MODES: Record<number, string> = {
  0: 'osu!',
  1: 'osu!taiko',
  2: 'osu!catch',
  3: 'osu!mania',
};
