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
exports.Player = void 0;
const typeorm_1 = require("typeorm");
const commend_1 = require("./commend");
let Player = class Player {
    constructor() {
        this.eventsPlayed = 0;
        this.eventsHosted = 0;
        this.tournamentsPlayed = 0;
        this.tournamentsHosted = 0;
        this.scoreTime = new Date;
    }
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Player.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Player.prototype, "eventsPlayed", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Player.prototype, "eventsHosted", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Player.prototype, "tournamentsPlayed", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Player.prototype, "tournamentsHosted", void 0);
__decorate([
    typeorm_1.OneToMany(() => commend_1.Commend, commend => commend.author),
    __metadata("design:type", Promise)
], Player.prototype, "commendsBy", void 0);
__decorate([
    typeorm_1.OneToMany(() => commend_1.Commend, commend => commend.subject),
    __metadata("design:type", Promise)
], Player.prototype, "commendsAbout", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Player.prototype, "scoreTime", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Player.prototype, "joinedAt", void 0);
Player = __decorate([
    typeorm_1.Entity()
], Player);
exports.Player = Player;
