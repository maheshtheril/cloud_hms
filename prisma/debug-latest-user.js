"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("../src/lib/prisma");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var user, company, modules, isHealthcare, hasCRM, hasHMS;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🔍 Inspecting Latest User...');
                    return [4 /*yield*/, prisma_1.prisma.app_user.findFirst({
                            orderBy: { created_at: 'desc' },
                            include: {
                                hms_user_roles: true
                            }
                        })];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        console.log('❌ No users found.');
                        return [2 /*return*/];
                    }
                    console.log("\uD83D\uDC64 User: ".concat(user.email, " (ID: ").concat(user.id, ")"));
                    console.log("   Tenant: ".concat(user.tenant_id));
                    console.log("   Created At: ".concat(user.created_at));
                    return [4 /*yield*/, prisma_1.prisma.company.findFirst({
                            where: { id: user.company_id || undefined }
                        })];
                case 2:
                    company = _a.sent();
                    console.log("\uD83C\uDFE2 Company: ".concat(company === null || company === void 0 ? void 0 : company.name));
                    console.log("   Industry: '".concat(company === null || company === void 0 ? void 0 : company.industry, "' (Raw: ").concat(JSON.stringify(company === null || company === void 0 ? void 0 : company.industry), ")"));
                    return [4 /*yield*/, prisma_1.prisma.tenant_module.findMany({
                            where: { tenant_id: user.tenant_id }
                        })];
                case 3:
                    modules = _a.sent();
                    console.log("\uD83D\uDCE6 Modules Found: ".concat(modules.length));
                    modules.forEach(function (m) {
                        console.log("   - Key: '".concat(m.module_key, "', Enabled: ").concat(m.enabled));
                    });
                    isHealthcare = !(company === null || company === void 0 ? void 0 : company.industry) || company.industry === 'Healthcare' || company.industry === 'Hospital';
                    hasCRM = modules.some(function (m) { return m.module_key === 'crm' && m.enabled; });
                    hasHMS = modules.some(function (m) { return m.module_key === 'hms' && m.enabled; });
                    console.log('\n🧮 Logic Verify:');
                    console.log("   isHealthcare (!industry || match): ".concat(isHealthcare));
                    console.log("   hasCRM: ".concat(hasCRM));
                    console.log("   hasHMS: ".concat(hasHMS));
                    if (hasCRM && !hasHMS) {
                        console.log('   => SHOULD Redirect to /crm/dashboard');
                    }
                    else if (isHealthcare) {
                        console.log('   => SHOULD Redirect to /hms/dashboard (Fallback)');
                    }
                    else {
                        console.log('   => Unclear destination');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) { return console.error(e); })
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, prisma_1.prisma.$disconnect()];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
