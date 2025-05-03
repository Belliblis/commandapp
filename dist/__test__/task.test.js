"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("../test");
test('return sum of two nubers', () => {
    expect((0, test_1.add)(1, 2)).toBe(3);
    expect((0, test_1.add)(-2, -3)).toBe(-5);
    expect((0, test_1.add)(0, 0)).toBe(0);
});
//# sourceMappingURL=task.test.js.map