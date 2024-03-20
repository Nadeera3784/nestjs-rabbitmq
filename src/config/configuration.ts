export default () => ({
  app: {
    app_url: process.env.APP_URL,
    environment: process.env.ENV,
    disk: process.env.STORAGE_UPLOAD_DESTINATION,
    upload_mx_size: process.env.STORAGE_UPLOAD_MAX_SIZE || 5242880,
    reqres_api: process.env.REQRES_API,
  },
  database: {
    mongodb: {
      uri: process.env.DB_URI,
    },
  },
  queue: {
    amqp: {
      uri: process.env.AMQP_URL,
    },
  },
  cache: {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  },
  throttler: {
    ttl: process.env.THROTTLER_TTL,
    limit: process.env.THROTTLER_LIMIT,
  },
});
