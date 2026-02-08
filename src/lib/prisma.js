"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var client_1 = require("@prisma/client");
var pg_1 = require("pg");
var adapter_pg_1 = require("@prisma/adapter-pg");
var prismaClientSingleton = function () {
    var connectionString = process.env.DATABASE_URL || 'postgresql://hms_admin:password@127.0.0.1:5432/hms_prod';
    console.log("[PRISMA] Initializing with:", connectionString.split('@')[1] || "DEFAULTS");
    var pool = new pg_1.Pool({ connectionString: connectionString });
    pool.on('error', function (err) { return console.error('[PRISMA] Pool Error:', err); });
    var adapter = new adapter_pg_1.PrismaPg(pool);
    return new client_1.PrismaClient({
        adapter: adapter,
        log: ['error', 'warn'],
    });
};
// Simple export without complex extensions for now to ensure stability
exports.prisma = (_a = globalThis.prismaGlobal) !== null && _a !== void 0 ? _a : prismaClientSingleton();
if (process.env.NODE_ENV !== 'production')
    globalThis.prismaGlobal = exports.prisma;
