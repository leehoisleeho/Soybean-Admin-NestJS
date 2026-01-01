"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const route_service_1 = require("./route.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let RouteController = class RouteController {
    routeService;
    constructor(routeService) {
        this.routeService = routeService;
    }
    async getUserRoutes(req) {
        return this.routeService.getUserRoutes(req.user.id);
    }
    async getConstantRoutes() {
        return this.routeService.getConstantRoutes();
    }
    async isRouteExist(routeName) {
        return this.routeService.isRouteExist(routeName);
    }
};
exports.RouteController = RouteController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '获取用户路由' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('getUserRoutes'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RouteController.prototype, "getUserRoutes", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '获取常量路由' }),
    (0, common_1.Get)('getConstantRoutes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RouteController.prototype, "getConstantRoutes", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '检查路由是否存在' }),
    (0, common_1.Get)('isRouteExist'),
    __param(0, (0, common_1.Query)('routeName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RouteController.prototype, "isRouteExist", null);
exports.RouteController = RouteController = __decorate([
    (0, swagger_1.ApiTags)('路由管理'),
    (0, common_1.Controller)('route'),
    __metadata("design:paramtypes", [route_service_1.RouteService])
], RouteController);
//# sourceMappingURL=route.controller.js.map