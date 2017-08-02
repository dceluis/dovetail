describe('The program', () => {

  it('has an init() function', () => {
    expect(init).toBeDefined();
  });

  describe('has a buildScene() function', () => {
    it('defined', () => {
      expect(buildScene).toBeDefined();
    });
    it('that adds an ambient light', () => {
      buildScene(4,15,3);
      expect(scene.children[0] instanceof THREE.AmbientLight).toBeTruthy();
    });
    it('that adds a directional light', () => {
      expect(scene.children[1] instanceof THREE.DirectionalLight).toBeTruthy();
    });
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

  describe('has a getReduction() function', () => {

    it('that is defined', () => {
      expect(getReduction).toBeDefined();
    });

    it('that works with degrees', () => {

      expect(getReduction({angle: 45, height: 10})).toBeTruthy();
      expect(() => {getReduction({angle: 90, height: 10});}).toThrow();

      expect(getReduction({angle: 10, height:10}) > getReduction({ angle:5 , height: 10})).toBe(true);
    });

    it('that works with side ratios', () => {

      expect(getReduction({hypot: 15, height:10 })).toBeTruthy();
      expect(()=>{getReduction({hypot: 0.2, height: 10});}).toThrow();

      expect(getReduction({hypot: 10, height:10}) < getReduction({ hypot:5 , height: 10})).toBe(true);
    });

    it('that can be used interchangeably', () => {
      var degrees = (Math.asin(1/8)/Math.PI *180);
      expect(getReduction({angle: degrees,height:10})).toBeCloseTo(getReduction({hypot: 8,height:10}),8); 
    });

  });

  describe('has a valid scene', () => {
    it('that is an instance of THREE.Scene', () => {
      expect(scene instanceof THREE.Scene).toBe(true);
    });
  });

  describe('has a PlankGroup constructor', () => {
    var plankGroup;

    it('that is defined', () => {
      expect(PlankGroup).toBeDefined();
    });

    it('that can be instanced', () => {
      expect( plankGroup = new PlankGroup({x: 10, y: 10, z: 10}) ).toBeTruthy();
      expect( plankGroup instanceof PlankGroup).toBeTruthy();
      expect( plankGroup.plank instanceof THREE.Mesh).toBeTruthy();
      expect( plankGroup.joins instanceof THREE.Group).toBeTruthy();
      expect( plankGroup.geometry instanceof THREE.BoxGeometry).toBeTruthy();
    });

    describe('whose instances', () => {

      describe('have a buildJoin() method', () => {
        it('that is defined', () => {
         expect(plankGroup.buildJoin).toBeDefined();
        });

        it('that returns a join', () => {
          join = plankGroup.buildJoin(10,10,10);
          expect(join instanceof THREE.Mesh).toBe(true);
          expect(join.geometry instanceof THREE.Geometry).toBe(true);
          expect(join.material instanceof THREE.Material).toBe(true);
        });
      });

      describe('have an addJoin() method', () => {
        beforeAll(() => {
           spyOn(plankGroup, 'buildJoin').and.callThrough();
        });

        it('that is defined', () => {
          expect(plankGroup.addJoin).toBeDefined();
        });

        it('that adds a Join', () => {
          var initial = plankGroup.joins.children.length;
          plankGroup.addJoin(10,10,10,-2);

          expect(plankGroup.buildJoin).toHaveBeenCalled();
          expect(plankGroup.joins.children.length).toEqual(initial+1);
        });

      });

    });

  });

});