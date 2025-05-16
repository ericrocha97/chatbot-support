import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

if (!redisUrl || !redisToken) {
  throw new Error('Missing Upstash Redis environment variables')
}

const redis = new Redis({
  url: redisUrl,
  token: redisToken,
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, '1d'),
  analytics: true,
})
