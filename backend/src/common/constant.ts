// Removed session constants - using JWT only now

export const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;
export const JWT_SECRET_TOKEN_TTL = 3600;

export const JWT_REFRESH_SECRET_TOKEN = process.env.JWT_REFRESH_SECRET_TOKEN;
export const JWT_REFRESH_SECRET_TOKEN_TTL = 7 * 24 * 3600;
export const RATE_LIMIT = process.env.RATE_LIMIT;
export const RATE_TTL_SECONDS = process.env.RATE_TTL_SECONDS;

export const CACHE_KEYS = {
	monitor_new_connections_cache_key: `monitor_new_dev_connections`,
};
