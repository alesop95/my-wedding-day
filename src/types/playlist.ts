import * as O from "fp-ts/Option";

export type PlaylistConfig = {
  spotifyUrl: string;
  enabled: boolean;
};

export type PlaylistState = {
  config: O.Option<PlaylistConfig>;
  loading: boolean;
  error: O.Option<string>;
};
