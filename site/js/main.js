function colorizeGeometry(e, t) {
    for (var n = 0; n < e.faces.length; n += 2) {
        var r = t ? 6396369 : 13736289;
        e.faces[n].color.setHex(r), e.faces[n + 1].color.setHex(r);
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
    document.getElementById("play-box").appendChild(t.dom), buildInputs(), buildScene(2, 4, 4, 15, 3);
    var n = function() {
        requestAnimationFrame(n), e(), t.update();
    };
    n();
}

function buildInputs() {
    document.getElementById("create").addEventListener("click", function() {
        var e = parseInt(document.getElementById("number").value), t = parseInt(document.getElementById("angle").value), n = parseFloat(document.getElementById("length").value), r = parseFloat(document.getElementById("aWidth").value), a = parseFloat(document.getElementById("bWidth").value);
        buildScene(r || 2, a || 4, e || 4, t || 15, n || 3);
    });
}

function buildScene(e, t, n, r, a) {
    scene = new THREE.Scene();
    var o = new THREE.AmbientLight(4210752);
    scene.add(o);
    var i = new THREE.DirectionalLight(16777215, 1);
    i.position.set(-10, 9, 6), i.castShadow = !0, scene.add(i);
    var s = new THREE.DirectionalLight(16777215, .6);
    s.position.set(10, -6, -7), s.castShadow = !0, scene.add(s);
    var c = new PlankGroup({
        x: e,
        y: 10,
        z: 24
    }, n), p = new PlankGroup({
        x: t,
        y: 10,
        z: 24
    }, n + 1, !0);
    generateDove(c, p, r, a), positionJoins(c, p), positionPlanks(c, p), scene.add(c), 
    scene.add(p), turnToFace("left");
}

function generateDove(e, t, n, r) {
    if (e.number + 1 != t.number || e.alternative || !t.alternative) throw new Error("Invalid arguments");
    for (var a = e.plank.geometry.parameters, o = t.plank.geometry.parameters.width, i = getReduction({
        angle: n,
        height: o
    }), s = r - 2 * i, c = (a.depth - s * e.number) / t.number, p = c - r, l = -a.depth / 2 + c / 2, m = 0; m < e.number + t.number; m++) m % 2 == 0 ? t.addJoin(r + p, s + p, o, a.width, l) : e.addJoin(r, s, o, a.width, l), 
    l += c / 2 + s / 2;
    t.joins.children[0].geometry.vertices[3].z -= i, t.joins.children[0].geometry.vertices[6].z -= i, 
    t.joins.children[t.joins.children.length - 1].geometry.vertices[2].z += i, t.joins.children[t.joins.children.length - 1].geometry.vertices[7].z += i;
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

function positionJoins(e, t) {
    var n = e.plank.geometry.parameters, r = t.plank.geometry.parameters;
    t.joins.rotateZ(Math.PI / 2), e.joins.position.y = n.height / 2 + r.width / 2, t.joins.position.y = r.height / 2 + n.width / 2;
}

function positionPlanks(e, t) {
    e.translateX(-(t.plank.geometry.parameters.height + e.plank.geometry.parameters.width) / 2), 
    t.rotateZ(Math.PI / 2), t.translateX((e.plank.geometry.parameters.height + t.plank.geometry.parameters.width) / 2);
}

function getReduction(e) {
    if (e.angle > 0 && e.angle < 90) t = Math.PI * e.angle / 180; else {
        if (!(e.hypot > 1)) throw new Error("Invalid angle or hypothenuse input");
        var t = Math.asin(1 / e.hypot);
    }
    return Math.tan(t) * e.height;
}

var renderer, tempObject3D, scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, 1, 1, 5e3);

camera.position.x = 0, camera.position.y = 0, camera.position.z = 70;

var controls, PlankGroup = function(e, t, n) {
    THREE.Object3D.call(this), this.type = "Group", this.plank = new THREE.Mesh(), this.lines = new THREE.WireframeGeometry(), 
    this.joins = new THREE.Group(), this.number = t, this.material = new THREE.MeshLambertMaterial({
        vertexColors: THREE.FaceColors,
        overdraw: .5,
        transparent: !1,
        opacity: 1
    }), this.geometry = colorizeGeometry(new THREE.BoxGeometry(e.x, e.y, e.z), n), this.plank = new THREE.Mesh(this.geometry, this.material), 
    this.plank.castShadow = !0, this.lines = new THREE.LineSegments(new THREE.WireframeGeometry(this.geometry)), 
    this.lines.material.opacity = .2, this.lines.material.transparent = !0, this.alternative = !!n, 
    this.add(this.plank), this.add(this.joins), this.addJoin = function(e, t, n, r, a) {
        var o = this.buildJoin(e, t, n, r);
        return o.position.z = a, this.joins.add(o), o;
    }, this.buildJoin = function(e, t, n, r) {
        var a = this.material, o = new THREE.BoxGeometry(r, n, e), i = (e - t) / 2;
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
        }), new THREE.Mesh(o, a);
    };
};

PlankGroup.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: THREE.Group
});