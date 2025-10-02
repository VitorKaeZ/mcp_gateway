"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Name = void 0;
const either_1 = require("../../../shared/either");
const invalid_name_1 = require("./errors/invalid.name");
class Name {
    constructor(name) {
        this.name = name;
        Object.freeze(this);
    }
    static create(name) {
        if (!Name.validate(name)) {
            return (0, either_1.left)(new invalid_name_1.InvalidNameError(name));
        }
        return (0, either_1.right)(new Name(name));
    }
    get value() {
        return this.name;
    }
    static validate(name) {
        if (!name || name.trim().length < 2 || name.trim().length > 255) {
            return false;
        }
        return true;
    }
}
exports.Name = Name;
