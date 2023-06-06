const treesharking = require("../treesharking")

describe('Treesharking', () => {
    it('单条语句', () => {
        expect(treesharking(
            `const a = () => 1;
            a();
            `
        ))
            .toBe(`const a = () => 1;a();`)
    })
    it('两条语句', () => {
        expect(treesharking(
            `const a = () => 1;
            const b = () => 1;
            a();
            `
        ))
            .toBe(`const a = () => 1;a();`)
    })
})