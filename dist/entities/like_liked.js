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
exports.Commend = void 0;
const typeorm_1 = require("typeorm");
const player_1 = require("./player");
let Commend = class Commend {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Commend.prototype, "authorId", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Commend.prototype, "subjectId", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Boolean)
], Commend.prototype, "host", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Boolean)
], Commend.prototype, "cheer", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Commend.prototype, "duplicates", void 0);
__decorate([
    typeorm_1.ManyToOne(() => player_1.Player, player => player.commendsBy, { primary: true }),
    typeorm_1.JoinColumn({ name: "authorId" }),
    __metadata("design:type", Promise)
], Commend.prototype, "author", void 0);
__decorate([
    typeorm_1.ManyToOne(() => player_1.Player, player => player.commendsAbout, { primary: true }),
    typeorm_1.JoinColumn({ name: "subjectId" }),
    __metadata("design:type", Promise)
], Commend.prototype, "subject", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Commend.prototype, "firstCommend", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Commend.prototype, "lastCommend", void 0);
Commend = __decorate([
    typeorm_1.Entity()
], Commend);
exports.Commend = Commend;
