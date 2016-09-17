var container, stats;

var camera, scene, renderer;

var mesh, geometry, model;

var loader;
$y = 0;
$m = 0;
var pointLight;
$speed = 0.005;
var mouseX = 0;
var mouseY = 0;
$mesh = false;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mouseup', function(){
	$speed = 0.005;
	glitchPass.goWild = false;
	model.scale.set(1,1,1);
	camera.position.z = 3000;		
}, false);

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 3000;

	//

	var path = "assets/images/cube/hv/";
	var format = '.png';
	var urls = [
			path + 'posz' + format, path + 'negz' + format,
			path + 'posx' + format, path + 'negx' + format,
			path + 'posy' + format, path + 'posz' + format
		];

	var reflectionCube = new THREE.CubeTextureLoader().load( urls );
	reflectionCube.format = THREE.RGBFormat;

	scene = new THREE.Scene();
	scene.background = reflectionCube;

	// LIGHTS

	var ambient = new THREE.AmbientLight( 0xffffff );
	scene.add( ambient );

	pointLight = new THREE.PointLight( 0xffffff, 2 );
	scene.add( pointLight );

	// light representation

	//var sphere = new THREE.SphereGeometry( 100, 16, 8 );

	//var mesh = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) );
	//mesh.scale.set( 0.05, 0.05, 0.05 );
	//pointLight.add( mesh );

	var refractionCube = new THREE.CubeTextureLoader().load( urls );
	refractionCube.mapping = THREE.CubeRefractionMapping;
	refractionCube.format = THREE.RGBFormat;

	var cubeMaterial3 = new THREE.MeshLambertMaterial( { color: 0xff6600, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.3 } );
	var cubeMaterial2 = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: refractionCube, refractionRatio: 0.95 } );
	var cubeMaterial1 = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: reflectionCube } );
	//

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	//


	//

	//loader = new THREE.BinaryLoader();
	//loader.load( "assets/models/WaltHead_bin.js", function( geometry ) { createScene( geometry, cubeMaterial1, cubeMaterial2, cubeMaterial3 ) } );

	var jsonModelURL = [  // available JSON model files
	    "assets/models/hv2.json",
	]
    var loader = new THREE.JSONLoader();
    loader.load(jsonModelURL[0], function( geometry ) { createScene( geometry, cubeMaterial2 ) });


	//

	composer = new THREE.EffectComposer( renderer );
	composer.addPass( new THREE.RenderPass( scene, camera ) );

	glitchPass = new THREE.GlitchPass();
	glitchPass.renderToScreen = true;
	composer.addPass( glitchPass );
	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function createScene( geometry, m2 ) {

	var s = 400;

	/*var mesh = new THREE.Mesh( geometry, m1 );
	mesh.position.z = - 100;
	mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
	scene.add( mesh );*/

	var mesh = new THREE.Mesh( geometry, m2 );
	mesh.position.z = 0;
	mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
	model = new THREE.Object3D();
	model.add(mesh);
	model.rotation.set(0,0,0);
	scene.add(model);
	
	//scene.add( mesh );
	render();
}
function onDocumentMouseDown(event) {
	glitchPass.goWild = true;
	$speed = -0.05;
	model.scale.set(2,2,2);
	camera.position.z = 800;
}

//
THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
    if(loaded === total){
	    $mesh = true;
    }
};
function animate() {

	requestAnimationFrame( animate );
	
	if($mesh){
		$m++;
		if($m > 2){
			model.rotation.y -= $speed;
			//new TWEEN.Tween( model.rotation ).to( {  y:  model.rotation.y + rad90}, 1000 ).easing( TWEEN.Easing.Quadratic.EaseOut).start();		
		} else{
			console.log('mesh, '+$m);		
		}	
	} else{
		console.log('no mesh');
	}

	composer.render();

}
function render() {

	var timer = -0.0002 * Date.now();
	//pointLight.position.x = 1500 * Math.cos( timer );
	//pointLight.position.z = 1500 * Math.sin( timer );

	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;

	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}