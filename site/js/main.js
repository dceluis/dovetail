function colorizeGeometry(e, t) {
    for (var n = 0; n < e.faces.length; n += 2) {
        var a = t ? 6396369 : 13736289;
        e.faces[n].color.setHex(a), e.faces[n + 1].color.setHex(a);
    }
    return e;
}

function init() {
    function e(e) {
        e.preventDefault(), mouse.x = e.offsetX / renderer.domElement.clientWidth * 2 - 1, 
        mouse.y = -e.offsetY / renderer.domElement.clientHeight * 2 + 1;
    }
    function t() {
        controls.update();
        var e = 0;
        tempObject3D && (Math.abs(tempObject3D.rotation.x - scene.rotation.x) > .05 ? scene.rotation.x += tempObject3D.steps.x : (scene.rotation.x = tempObject3D.rotation.x, 
        e += 1), Math.abs(tempObject3D.rotation.y - scene.rotation.y) > .05 ? scene.rotation.y += tempObject3D.steps.y : (scene.rotation.y = tempObject3D.rotation.y, 
        e += 1), Math.abs(tempObject3D.rotation.z - scene.rotation.z) > .05 ? scene.rotation.z += tempObject3D.steps.z : (scene.rotation.z = tempObject3D.rotation.z, 
        e += 1), 3 == e && (tempObject3D = void 0)), raycaster.setFromCamera(mouse, camera), 
        (intersects = raycaster.intersectObjects([ scene.children[3].joins.children[0] ])).length > 0 ? INTERSECTED != intersects[0].object && (INTERSECTED && INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex), 
        (INTERSECTED = intersects[0].object).currentHex = INTERSECTED.material.emissive.getHex(), 
        INTERSECTED.material.emissive.setHex(1118481)) : (INTERSECTED && INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex), 
        INTERSECTED = null), renderer.render(scene, camera);
    }
    (renderer = new THREE.WebGLRenderer({
        antialias: !0
    })).shadowMap.enabled = !0, renderer.shadowMap.type = THREE.PCFSoftShadowMap, renderer.setSize(500, 500), 
    renderer.setClearColor(15790320), document.getElementById("play-box").appendChild(renderer.domElement), 
    (controls = new THREE.TrackballControls(camera, renderer.domElement)).rotateSpeed = 1.5, 
    controls.noZoom = !1, controls.noPan = !1;
    var n = new Stats();
    document.getElementById("play-box").appendChild(n.dom), renderer.domElement.addEventListener("mousemove", e, !1), 
    buildInputs(), buildScene(30, 2, 4, 4, 15, 3);
    var a = function() {
        requestAnimationFrame(a), t(), n.update();
    };
    a();
}

function buildInputs() {
    function e() {
        return parseInt(n.value) * parseFloat(r.value) + 2 * getReduction({
            angle: parseInt(a.value),
            height: parseFloat(s.value)
        });
    }
    var t = document.getElementById("create"), n = document.getElementById("number"), a = document.getElementById("angle"), r = document.getElementById("jLength"), o = document.getElementById("length"), i = document.getElementById("aWidth"), s = document.getElementById("bWidth");
    t.addEventListener("click", function() {
        var e = parseInt(n.value), t = parseInt(a.value), c = parseFloat(r.value), l = parseFloat(o.value), d = parseFloat(i.value), m = parseFloat(s.value);
        buildScene(l || 30, d || 2, m || 4, e || 4, t || 15, c || 3);
    }), document.getElementById("params").addEventListener("input", function(n) {
        n.stopPropagation(), "number" == n.target.type && (console.log(e()), parseFloat(o.value) < e() ? (console.log("disabled length"), 
        t.setAttribute("disabled", "disabled")) : getReduction({
            angle: parseInt(a.value),
            height: parseFloat(s.value)
        }) > parseFloat(r.value) / 2 ? (console.log("disabled reduction"), t.setAttribute("disabled", "disabled")) : (console.log("enabled"), 
        t.removeAttribute("disabled")));
    });
}

function buildScene(e, t, n, a, r, o) {
    scene = new THREE.Scene();
    var i = new THREE.AmbientLight(4210752);
    scene.add(i);
    var s = new THREE.DirectionalLight(16777215, 1);
    s.position.set(-10, 9, 6), s.castShadow = !0, scene.add(s);
    var c = new THREE.DirectionalLight(16777215, .6);
    c.position.set(10, -6, -7), c.castShadow = !0, scene.add(c);
    var l = new PlankGroup({
        x: t,
        y: 10,
        z: e
    }, a), d = new PlankGroup({
        x: n,
        y: 10,
        z: e
    }, a + 1, !0);
    generateDove(l, d, r, o), positionJoins(l, d), positionPlanks(l, d), scene.add(l), 
    scene.add(d), new THREE.FontLoader().load("font/Lato_Regular.json", function(e) {
        new THREE.LineBasicMaterial({
            color: 16777215,
            side: THREE.DoubleSide
        });
        var t, n = new THREE.MeshBasicMaterial({
            color: 16777215,
            transparent: !0,
            opacity: .8,
            side: THREE.DoubleSide
        }), a = o + "cm", r = e.generateShapes(a, .5), i = new THREE.ShapeGeometry(r);
        (t = new THREE.Mesh(i, n)).position.x = -3, l.joins.children[0].add(t);
    }), turnToFace("left");
}

function generateDove(e, t, n, a) {
    if (e.number + 1 != t.number || e.alternative || !t.alternative) throw new Error("Invalid arguments");
    for (var r = e.plank.geometry.parameters, o = t.plank.geometry.parameters.width, i = getReduction({
        angle: n,
        height: o
    }), s = a - 2 * i, c = (r.depth - s * e.number) / t.number, l = c - a, d = -r.depth / 2 + c / 2, m = 0; m < e.number + t.number; m++) m % 2 == 0 ? t.addJoin(a + l, s + l, o, r.width, d) : e.addJoin(a, s, o, r.width, d), 
    d += c / 2 + s / 2;
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
    var n = e.plank.geometry.parameters, a = t.plank.geometry.parameters;
    t.joins.rotateZ(Math.PI / 2), e.joins.position.y = n.height / 2 + a.width / 2, t.joins.position.y = a.height / 2 + n.width / 2;
}

function positionPlanks(e, t) {
    e.translateX(-(t.plank.geometry.parameters.height + e.plank.geometry.parameters.width) / 2), 
    t.rotateZ(Math.PI / 2), t.translateX((e.plank.geometry.parameters.height + t.plank.geometry.parameters.width) / 2);
}

function getReduction(e) {
    if (e.angle > 0 && e.angle < 90) t = THREE.Math.degToRad(e.angle); else {
        if (!(e.hypot > 1)) throw new Error("Invalid angle or hypothenuse input");
        var t = Math.asin(1 / e.hypot);
    }
    return Math.tan(t) * e.height;
}

var renderer, tempObject3D, scene = new THREE.Scene(), raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2(), INTERSECTED, intersects, camera = new THREE.PerspectiveCamera(30, 1, 1, 5e3);

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
    this.add(this.plank), this.add(this.joins), this.addJoin = function(e, t, n, a, r) {
        var o = this.buildJoin(e, t, n, a);
        return o.position.z = r, this.joins.add(o), o;
    }, this.buildJoin = function(e, t, n, a) {
        var r = this.material, o = new THREE.BoxGeometry(a, n, e), i = (e - t) / 2;
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