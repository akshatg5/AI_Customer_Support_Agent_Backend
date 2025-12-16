import rateLimit from "express-rate-limit";

// genral API Rate limiter
export const apiLimiter = rateLimit({
    windowMs : 15 * 60 * 100, // 15 minutes
    max : 100, //limit to 100 reqs per windowMs
    message : 'Too many requests from this IP, please try again later.',
    standardHeaders : true, // return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false
})

// strict limiter for auth routes
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max : 5,
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
})

// Chat rate limiter
export const chatLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 messages per minute
    message: 'Too many messages sent, please slow down.',
    standardHeaders: true,
    legacyHeaders: false,
  });