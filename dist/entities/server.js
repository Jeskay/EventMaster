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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const typeorm_1 = require("typeorm");
const occasion_1 = require("./occasion");
const settings_1 = require("./settings");
let Server = class Server {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Server.prototype, "guild", void 0);
__decorate([
    typeorm_1.OneToMany(() => occasion_1.Occasion, occasion => occasion.server),
    __metadata("design:type", Array)
], Server.prototype, "events", void 0);
__decorate([
    typeorm_1.Column(() => settings_1.Settings),
    __metadata("design:type", settings_1.Settings)
], Server.prototype, "settings", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Server.prototype, "eventChannel", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Server.prototype, "eventCategory", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Server.prototype, "joinedAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Server.prototype, "description", void 0);
Server = __decorate([
    typeorm_1.Entity()
], Server);
exports.Server = Server;
