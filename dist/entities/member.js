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
exports.GuildMember = void 0;
const typeorm_1 = require("typeorm");
const player_1 = require("./player");
const server_1 = require("./server");
let GuildMember = class GuildMember {
    constructor() {
        this.banned = false;
        this.eventsPlayed = 0;
        this.eventsHosted = 0;
        this.tournamentsPlayed = 0;
        this.tournamentsHosted = 0;
        this.minutesPlayed = 0;
        this.scoreTime = new Date;
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], GuildMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], GuildMember.prototype, "guildId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => player_1.Player, player => player.membership, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id' }),
    __metadata("design:type", player_1.Player)
], GuildMember.prototype, "player", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => server_1.Server, server => server.members, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: "guildId" }),
    __metadata("design:type", server_1.Server)
], GuildMember.prototype, "guild", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], GuildMember.prototype, "banned", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GuildMember.prototype, "eventsPlayed", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GuildMember.prototype, "eventsHosted", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GuildMember.prototype, "tournamentsPlayed", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GuildMember.prototype, "tournamentsHosted", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], GuildMember.prototype, "minutesPlayed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], GuildMember.prototype, "scoreTime", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], GuildMember.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GuildMember.prototype, "joinedAt", void 0);
GuildMember = __decorate([
    (0, typeorm_1.Entity)()
], GuildMember);
exports.GuildMember = GuildMember;
