export enum TokenExpirationTime {
  ACCESS = '1h',
  REFRESH_LONG = '7d',
  REFRESH_SHORT = '2h',
}

export enum TokenExpirationTimeMs {
  ACCESS = 60 * 60 * 1000,
  REFRESH_LONG = 7 * 24 * 60 * 60 * 1000,
  REFRESH_SHORT = 2 * 60 * 60 * 1000,
}
