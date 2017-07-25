function colorizeGeometry(e, t) {
    for (var n = 0; n < e.faces.length; n += 2) {
        var a = t ? 6396369 : 13736289;
        e.faces[n].color.setHex(a), e.faces[n + 1].color.setHex(a);
    }
    return e;
}

function init() {
    function e() {
        controls.update();
        var e = 0;
        tempObject3D && (Math.abs(tempObject3D.rotation.x - scene.rotation.x) > .05 ? scene.rotation.x += tempObject3D.steps.x : (scene.rotation.x = tempObject3D.rotation.x, 
        e += 1), Math.abs(tempObject3D.rotation.y - scene.rotation.y) > .05 ? scene.rotation.y += tempObject3D.steps.y : (scene.rotation.y = tempObject3D.rotation.y, 
        e += 1), Math.abs(tempObject3D.rotation.z - scene.rotation.z) > .05 ? scene.rotation.z += tempObject3D.steps.z : (scene.rotation.z = tempObject3D.rotation.z, 
        e += 1), 3 == e && (tempObject3D = void 0)), renderer.render(scene, camera);
    }
    (renderer = new THREE.WebGLRenderer()).shadowMap.enabled = !0, renderer.shadowMap.type = THREE.PCFSoftShadowMap, 
    renderer.setSize(500, 500), renderer.setClearColor(15790320), document.getElementById("play-box").appendChild(renderer.domElement), 
    (controls = new THREE.TrackballControls(camera, renderer.domElement)).rotateSpeed = 1.5, 
    controls.noZoom = !1, controls.noPan = !1;
    var t = new Stats();
    document.getElementById("play-box").appendChild(t.dom), buildInputs(), buildScene(4, 75, 3);
    var n = function() {
        requestAnimationFrame(n), e(), t.update();
    };
    n();
}

function buildInputs() {
    document.getElementById("create").addEventListener("click", function() {
        var e = parseInt(document.getElementById("number").value), t = parseInt(document.getElementById("angle").value), n = parseFloat(document.getElementById("length").value);
        console.log(n), buildScene(e || 4, t || 75, n || 3);
    });
}

function buildScene(e, t, n) {
    scene = new THREE.Scene();
    var a = new THREE.AmbientLight(4210752);
    scene.add(a);
    var r = new THREE.DirectionalLight(16777215, 1);
    r.position.set(-10, 9, 6), r.castShadow = !0, scene.add(r);
    var o = new THREE.DirectionalLight(16777215, .6);
    o.position.set(10, -6, -7), o.castShadow = !0, scene.add(o);
    var i = buildPlank({
        x: 2,
        y: 10,
        z: 24
    }), s = buildPlank({
        x: 4,
        y: 10,
        z: 24
    }, !0);
    generateDove(i, e + 0, t, n), generateDove(s, e + 1, t, n), positionJoins(i), positionJoins(s), 
    positionPlanks(i, s), scene.add(i), scene.add(s), turnToFace("left");
}

function generateDove(e, t, n, a) {
    for (var r = e.plank.geometry.parameters, o = r.width * (e.alternative ? 1 : 2), i = a || o, s = i - 2 * getReduction(n, o), c = i - s, l = (r.depth - s * (t - (e.alternative ? 1 : 0))) / (t + (e.alternative ? 0 : 1)), d = i - l, p = -r.depth / 2 + l / 2 + (l + s) * (e.alternative ? 0 : .5), m = 0; m < t; m++) e.alternative ? e.addJoin(i - d, s - d, o, p) : e.addJoin(i, s, o, p), 
    p += l + s;
    e.alternative && (e.joins.children[0].geometry.vertices[3].z -= c / 2, e.joins.children[0].geometry.vertices[6].z -= c / 2, 
    e.joins.children[e.joins.children.length - 1].geometry.vertices[2].z += c / 2, e.joins.children[e.joins.children.length - 1].geometry.vertices[7].z += c / 2);
}

function turnToFace(e) {
    function t(e) {
        return Math.PI * e / 180;
    }
    switch (tempObject3D = new THREE.Mesh(), tempObject3D.steps = {}, tempObject3D.rotation.copy(camera.rotation), 
    e) {
      case "top":
        tempObject3D.rotateX(t(90));
        break;

      case "bottom":
        tempObject3D.rotateX(t(-90));
        break;

      case "left":
        tempObject3D.rotateY(t(90));
        break;

      case "right":
        tempObject3D.rotateY(t(-90));
        break;

      case "front":
        break;

      case "back":
        tempObject3D.rotateY(t(-180));
        break;

      default:
        throw "Not a valid face";
    }
    tempObject3D.steps.x = (tempObject3D.rotation.x - scene.rotation.x) / 30, tempObject3D.steps.y = (tempObject3D.rotation.y - scene.rotation.y) / 30, 
    tempObject3D.steps.z = (tempObject3D.rotation.z - scene.rotation.z) / 30;
}

function getMaterial() {
    return new THREE.MeshLambertMaterial({
        vertexColors: THREE.FaceColors,
        overdraw: .5,
        transparent: !1,
        opacity: 1
    });
}

function buildPlank(e, t) {
    var n = new PlankGroup(), a = getMaterial(), r = colorizeGeometry(new THREE.BoxGeometry(e.x, e.y, e.z), t);
    return n.plank = new THREE.Mesh(r, a), n.plank.castShadow = !0, n.lines = new THREE.LineSegments(new THREE.WireframeGeometry(r)), 
    n.lines.material.opacity = .2, n.lines.material.transparent = !0, n.alternative = !!t, 
    n.add(n.plank), n.add(n.joins), n;
}

function positionJoins(e) {
    var t = e.plank.geometry.parameters;
    e.alternative && e.joins.rotateZ(Math.PI / 2), e.joins.position.y = t.height / 2 + t.width / (e.alternative ? 4 : 1);
}

function positionPlanks(e, t) {
    e.translateX(-(t.plank.geometry.parameters.height + e.plank.geometry.parameters.width) / 2), 
    t.rotateZ(Math.PI / 2), t.translateX((e.plank.geometry.parameters.height + t.plank.geometry.parameters.width) / 2);
}

function getReduction(e, t) {
    var n = Math.PI * e / 180;
    return Math.tan(Math.PI / 2 - n) * t;
}

document.addEventListener("DOMContentLoaded", init);

var renderer, tempObject3D, scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, 1, 1, 5e3);

camera.position.x = 0, camera.position.y = 0, camera.position.z = 70;

var controls, PlankGroup = function() {
    THREE.Object3D.call(this), this.type = "Group", this.plank = new THREE.Mesh(), this.lines = new THREE.WireframeGeometry(), 
    this.joins = new THREE.Group(), this.addJoin = function(e, t, n, a) {
        var r = this.buildJoin(e, t, n);
        return r.position.z = a, this.joins.add(r), r;
    }, this.buildJoin = function(e, t, n) {
        var a = this.plank.geometry.parameters.width * (this.alternative ? 1 : 2), r = getMaterial(), o = new THREE.BoxGeometry(a / 2, n, e), i = (e - t) / 2;
        return (o = colorizeGeometry(o, this.alternative)).vertices[2].add({
            x: 0,
            y: 0,
            z: -i
        }), o.vertices[7].add({
            x: 0,
            y: 0,
            z: -i
        }), o.vertices[3].add({
            x: 0,
            y: 0,
            z: +i
        }), o.vertices[6].add({
            x: 0,
            y: 0,
            z: +i
        }), new THREE.Mesh(o, r);
    };
};

PlankGroup.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: THREE.Group
});