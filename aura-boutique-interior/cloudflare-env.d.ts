declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    AURA_ADMIN_PASSWORD_HASH?: string;
    AURA_ADMIN_EMAIL?: string;
  }
}
