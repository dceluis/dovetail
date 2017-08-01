describe('The program', () => {

  it('has an init() function', () => {
    expect(init).toBeDefined();
  });

  it('has a buildScene() function', () => {
    expect(buildScene).toBeDefined();
  });

  it('has a generateDove() function', () => {
    expect(generateDove).toBeDefined();
  });

  it('has a positionJoins() function', () => {
    expect(positionJoins).toBeDefined();
  });

  it('has a positionPlanks() function', () => {
    expect(positionPlanks).toBeDefined();
  });

  it('has a colorizeGeometry() function', () => {
    expect(colorizeGeometry).toBeDefined();
  });

  it('has a getReduction() function', () => {
    expect(getReduction).toBeDefined();
  });

  describe('has a valid scene', () => {
    it('the scene object is an instance of THREE.Scene', () => {
      expect(scene instanceof THREE.Scene).toBe(true);
    });
  });

  describe('has a PlankGroup constructor', () => {
    var plankGroup;

    it('is defined', () => {
      expect(PlankGroup).toBeDefined();
    });

    it('can be instanced', () => {
      expect( plankGroup = new PlankGroup({x: 10, y: 10, z: 10}) ).toBeTruthy();
    });

    describe('instances', () => {

      it('have a buildJoin() method', () => {
        expect(plankGroup.buildJoin).toBeDefined();
      });

      describe('have an addJoin() method', () => {

        it('is defined', () => {
          expect(plankGroup.addJoin).toBeDefined();
        });

        it('adds a Join', () => {
          var initial = plankGroup.joins.children.length;
          plankGroup.addJoin(10,10,10,-2);

          expect(plankGroup.joins.children.length).toEqual(initial+1);
        });

      });

    });

  });

});