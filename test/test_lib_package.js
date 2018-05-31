const Package = require('../src/lib/package');

describe('lib/package', () => {
  it('Should load an Object', () => {
    expect(Package).to.be.an('Object');
  });

  it('Should contains expected fields', () => {
    expect(Package).to.include.all.keys(['name', 'version']);
  });
});
