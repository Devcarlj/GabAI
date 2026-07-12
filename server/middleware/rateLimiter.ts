// src/middleware/rateLimiter.middleware.ts
import { rateLimit } from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute monitoring window
    limit: 15, // Strict 5 request cap per window for auth actions
    message: {
        message: "Too many authentication attempts from this IP. Please try again after 15 minutes.",
        error: true,
        success: false
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

export const geocodeLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    limit: 30, // generous per-IP cap — the controller-side cache absorbs repeat lookups
    message: {
        message: "Too many location lookups from this IP. Please slow down.",
        error: true,
        success: false
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});