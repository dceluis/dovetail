var renderer;

var tempObject3D;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(30, 1, 1, 5000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 70;

var controls;

var PlankGroup = function PlankGroup(options,number,alternative) {
  THREE.Object3D.call ( this );
  this.type = 'Group';

  this.plank = new THREE.Mesh();
  this.lines = new THREE.WireframeGeometry();
  this.joins = new THREE.Group();
  this.number = number;

  this.material = new THREE.MeshLambertMaterial({
    vertexColors: THREE.FaceColors,
    overdraw: 0.5,
    transparent: false,
    opacity: 1,
  })
  this.geometry = colorizeGeometry( new THREE.BoxGeometry( options.x,options.y,options.z ),alternative);
  
  this.plank = new THREE.Mesh( this.geometry, this.material );
  this.plank.castShadow = true;

  this.lines = new THREE.LineSegments( new THREE.WireframeGeometry( this.geometry ) );
  // this.lines.material.depthTest = false;
  this.lines.material.opacity = 0.2;
  this.lines.material.transparent = true;

  this.alternative = !!alternative;
  this.add( this.plank );
  // this.add( this.lines );
  this.add( this.joins );

  this.addJoin = function addJoin(top,bottom,height,positionZ){

    var join = this.buildJoin(top,bottom,height);

    join.position.z = positionZ;

    this.joins.add(join);
    return join;
  };

  this.buildJoin = function buildJoin(top,bottom,height){
    var _width = this.plank.geometry.parameters.width * (this.alternative ? 1 : 2 );
    var material = this.material;
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

  buildScene(4,15,3);

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
    buildScene(number || 4 ,angle || 15 ,length || 3);
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

  var plank1 = new PlankGroup({x: 2, y: 10, z: 24},number);
  var plank2 = new PlankGroup({x: 4, y: 10, z: 24},number+1,true);

  generateDove(plank1,plank2,angle,top);
  positionJoins(plank1);
  positionJoins(plank2);
  positionPlanks(plank1,plank2);

  scene.add(plank1);
  scene.add(plank2);

  turnToFace("left");
}

function generateDove(planka,plankb,angle,top){
  if((planka.number+1 != plankb.number) || planka.alternative || !plankb.alternative)
    throw new Error("Invalid arguments");

  var plankaParams = planka.plank.geometry.parameters;
  var plankbParams = plankb.plank.geometry.parameters;

  var joinHeight = plankbParams.width;

  var reduction = getReduction({ angle: angle, height: joinHeight });

  var bot = top - reduction*2;
  var freeSpace = plankaParams.depth - ( bot * (planka.number) );

  var altJoinTop = freeSpace/plankb.number;
  var diff = altJoinTop - top;

  var nextPosition = - plankaParams.depth/2 + (altJoinTop/2);

  for( var i = 0 ; i  < planka.number + plankb.number ; i++ ){
    if(i%2 === 0) 
      plankb.addJoin(top + diff,bot + diff,joinHeight,nextPosition);
    else
      planka.addJoin(top,bot,joinHeight,nextPosition);

    nextPosition += altJoinTop/2 + bot/2;
  }

  plankb.joins.children[0].geometry.vertices[3].z -= reduction;
  plankb.joins.children[0].geometry.vertices[6].z -= reduction;
  plankb.joins.children[plankb.joins.children.length-1].geometry.vertices[2].z += reduction;
  plankb.joins.children[plankb.joins.children.length-1].geometry.vertices[7].z += reduction;
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

function positionJoins(plank){
  var plankParams = plank.plank.geometry.parameters;

  if(plank.alternative)
    plank.joins.rotateZ(Math.PI/2);

  plank.joins.position.y = plankParams.height/2 + plankParams.width / (plank.alternative ? 4 : 1);
}

function positionPlanks(planka,plankb){
  planka.translateX(-(plankb.plank.geometry.parameters.height + planka.plank.geometry.parameters.width)/2);
  plankb.rotateZ(Math.PI/2);
  plankb.translateX( (planka.plank.geometry.parameters.height + plankb.plank.geometry.parameters.width)/2);
}

function getReduction(options){
  if( options.angle > 0 && options.angle < 90 ){
    var radiansAngle = Math.PI * options.angle / 180;
    
  }
  else if ( options.hypot > 1 ){
    var radiansAngle = Math.asin(1/options.hypot);
  }
  else
    throw new Error('Invalid angle or hypothenuse input');

  var reduction = Math.tan(radiansAngle) * options.height;
  return reduction;
}