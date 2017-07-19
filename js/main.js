document.addEventListener("DOMContentLoaded",init)

var renderer;

var tempObject3D;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(30, 1, 1, 5000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 70;

var controls;

var PlankGroup = function PlankGroup() {
  THREE.Object3D.call ( this );
  this.type = 'Group';

  this.plank = new THREE.Mesh();
  this.lines = new THREE.WireframeGeometry();
  this.joins = new THREE.Group();

  this.addJoin = function addJoin(top,bottom,height,positionZ){

    var join = this.buildJoin(top,bottom,height);

    join.position.z = positionZ;

    this.joins.add(join);
    return join;
  };

  this.buildJoin = function buildJoin(top,bottom,height){
    var _width = this.plank.geometry.parameters.width * (this.alternative ? 1 : 2 );
    var material = getMaterial();
    var geometry = new THREE.BoxGeometry(_width/2,height,top);
        geometry = colorizeGeometry( geometry,this.alternative);

    var reduction = (top - bottom) / 2;

    geometry.vertices[2].add({x: 0, y: 0, z: -reduction});
    geometry.vertices[7].add({x: 0, y: 0, z: -reduction});
    geometry.vertices[3].add({x: 0, y: 0, z: +reduction});
    geometry.vertices[6].add({x: 0, y: 0, z: +reduction});

    var join = new THREE.Mesh( geometry, material );
    return join;
  };

};
PlankGroup.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {
  constructor: THREE.Group
});

function colorizeGeometry(geometry,a) {
  for (var i = 0; i < geometry.faces.length; i += 2) {
    var hex = a ? 0x6199d1 : 0xd19961;
    geometry.faces[i].color.setHex(hex);
    geometry.faces[i + 1].color.setHex(hex);
  }
  return geometry;
}

function init () {

  // var updateInfo = build_updateInfo();

  renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(500, 500);
  renderer.setClearColor( 0xF0F0F0 );
  document.getElementById("play-box").appendChild(renderer.domElement);

  controls = new THREE.TrackballControls(camera,renderer.domElement);
  controls.rotateSpeed = 1.5;
  controls.noZoom = false;
  controls.noPan = false;

  var stats = new Stats();
  document.getElementById("play-box").appendChild( stats.dom );


  buildInputs();

  buildScene(4,75,3);

  var animate = function() {
    requestAnimationFrame(animate);
    render();
    stats.update();
  };

  animate();

  function render() {
    controls.update();
    var completed = 0;
    if(tempObject3D){
      if( Math.abs(tempObject3D.rotation.x-scene.rotation.x) > 0.05 )
        scene.rotation.x += tempObject3D.steps.x;
      else {
        scene.rotation.x = tempObject3D.rotation.x;
        completed += 1;
      }

      if( Math.abs(tempObject3D.rotation.y-scene.rotation.y) > 0.05 )
        scene.rotation.y += tempObject3D.steps.y;
      else {
        scene.rotation.y = tempObject3D.rotation.y;
        completed += 1;
      }

      if( Math.abs(tempObject3D.rotation.z-scene.rotation.z) > 0.05 )
        scene.rotation.z += tempObject3D.steps.z;
      else {
        scene.rotation.z = tempObject3D.rotation.z;
        completed += 1;
      }

      if (completed == 3){
        tempObject3D = undefined;
      }
    }
    // actually render the scene
    renderer.render( scene, camera );
  }
  
}

function buildInputs(){
  var createButton = document.getElementById("create");
  createButton.addEventListener("click",function(){
    var number = parseInt(document.getElementById("number").value);
    var angle  = parseInt(document.getElementById("angle").value);
    var length = parseFloat(document.getElementById("length").value);
    console.log(length);
    buildScene(number || 4 ,angle || 75 ,length || 3);
  });
}

function buildScene(number,angle,top){
  scene = new THREE.Scene();


  var ambient = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( ambient );

  var light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set(-10,9,6);
  light.castShadow = true;
  scene.add( light );

  var light2 = new THREE.DirectionalLight( 0xffffff , 0.6);
  light2.position.set(10,-6,-7);
  light2.castShadow = true;
  scene.add( light2 );

  var plank1 = buildPlank({x: 2, y: 10, z: 24});
  var plank2 = buildPlank({x: 4, y: 10, z: 24},true);

  generateDove(plank1,number+0,angle,top);
  generateDove(plank2,number+1,angle,top);

  positionJoins(plank1);
  positionJoins(plank2);
  positionPlanks(plank1,plank2);

  scene.add(plank1);
  scene.add(plank2);

  turnToFace("left");
}

function generateDove(plank,number,angle,top){
  var plankParams = plank.plank.geometry.parameters;

  var joinHeight = plankParams.width*(plank.alternative ? 1 : 2);
  var joinTop = top || joinHeight;
  var joinBot = joinTop - getReduction(angle,joinHeight)*2;
  var diff1 = joinTop - joinBot;

  var freeSpace = plankParams.depth - ( joinBot * (number - (plank.alternative ? 1 : 0)) );

  var altJoinTop = freeSpace/(number + (plank.alternative ? 0 : 1) );
  var diff = joinTop - altJoinTop;

  var array = [];

  var nextPosition = - plankParams.depth/2 + (altJoinTop/2) + (altJoinTop + joinBot)*(plank.alternative ? 0 : 0.5);

  for( var i = 0 ; i  < number ; i++ ){
    if(plank.alternative)
      plank.addJoin(joinTop-diff,joinBot-diff,joinHeight,nextPosition);
    else
      plank.addJoin(joinTop,joinBot,joinHeight,nextPosition);

    nextPosition += altJoinTop + joinBot;
  }

  if(plank.alternative){
    plank.joins.children[0].geometry.vertices[3].z -= diff1/2;
    plank.joins.children[0].geometry.vertices[6].z -= diff1/2;
    plank.joins.children[plank.joins.children.length-1].geometry.vertices[2].z += diff1/2;
    plank.joins.children[plank.joins.children.length-1].geometry.vertices[7].z += diff1/2;
  }
}

function turnToFace(face){
  tempObject3D = new THREE.Mesh;
  tempObject3D.steps = {};
  tempObject3D.rotation.copy(camera.rotation);
  switch (face){
    case "top":
      tempObject3D.rotateX(dta(90));
      break;
    case "bottom":
      tempObject3D.rotateX(dta(-90));
      break;
    case "left":
      tempObject3D.rotateY(dta(90));
      break;
    case "right":
      tempObject3D.rotateY(dta(-90));
      break;
    case "front":
      break;
    case "back":
      tempObject3D.rotateY(dta(-180));
      break;
    default:
      throw "Not a valid face";
  }
  tempObject3D.steps.x = (tempObject3D.rotation.x - scene.rotation.x)/30;
  tempObject3D.steps.y = (tempObject3D.rotation.y - scene.rotation.y)/30;
  tempObject3D.steps.z = (tempObject3D.rotation.z - scene.rotation.z)/30;
  
  function dta(x){
    return Math.PI * x / 180;
  }
}

function getMaterial(){
  var material = new THREE.MeshLambertMaterial({
    vertexColors: THREE.FaceColors,
    overdraw: 0.5,
    transparent: false,
    opacity: 1,
  })
  return material;
}

function buildPlank(options,alternative){

  var plankGroup = new PlankGroup();
  var material = getMaterial();
  var geometry = colorizeGeometry( new THREE.BoxGeometry( options.x,options.y,options.z ),alternative);
  
  plankGroup.plank = new THREE.Mesh( geometry, material );
  plankGroup.plank.castShadow = true;

  plankGroup.lines = new THREE.LineSegments( new THREE.WireframeGeometry( geometry ) );
  // plankGroup.lines.material.depthTest = false;
  plankGroup.lines.material.opacity = 0.2;
  plankGroup.lines.material.transparent = true;
  
  plankGroup.alternative = !!alternative;
  plankGroup.add( plankGroup.plank );
  // plankGroup.add( plankGroup.lines );
  plankGroup.add( plankGroup.joins );

  return plankGroup;
}

function positionJoins(plank){
  var plankParams = plank.plank.geometry.parameters;

  if(plank.alternative)
    plank.joins.rotateZ(Math.PI/2);

  plank.joins.position.y = plankParams.height/2 + plankParams.width / (plank.alternative ? 4 : 1);
}

function positionPlanks(planka,plankb){
  planka.translateX(-(plankb.plank.geometry.parameters.height + planka.plank.geometry.parameters.width)/2);
  plankb.rotateZ(Math.PI/2);
  plankb.translateX((planka.plank.geometry.parameters.height + plankb.plank.geometry.parameters.width)/2);
}

function getReduction(angle,height){
  var radians = Math.PI * angle / 180;
  var reduction = Math.tan(Math.PI/2 - radians) * height;
  return reduction;
}