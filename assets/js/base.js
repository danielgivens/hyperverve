var container, stats;

var camera, scene, renderer;

var mesh, geometry, model;
$body = $('body');
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
$enableMove= false;
init();
animate();


document.addEventListener('mousemove', onDocumentMouseMove, false);
//document.addEventListener('touchmove', onDocumentMouseMove, false);
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('touchstart', onDocumentMouseDown, false);
document.addEventListener('mouseup', onDocumentMouseUp, false);
document.addEventListener('touchend', onDocumentMouseUp, false);

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 3000;

	//

	var path = "assets/images/cube/hv/";
	var format = '.png';
	var urls = [
			path + 'posy' + format, path + 'negy' + format,
			path + 'posx' + format, path + 'negx' + format,
			path + 'negz' + format, path + 'posz' + format
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
	model.scale.set(4,4,4);
	//camera.position.z = 800;
	$enableMove= true;
	//reflectionCube.rotation.set(0,2,0);
	$body.addClass('pressed');
}
function onDocumentMouseMove(event) {
	if($enableMove){
		mouseX = ( event.clientX - windowHalfX ) * 4;
		mouseY = ( event.clientY - windowHalfY ) * 4;
		if($mesh){

		}
	}
}
function onDocumentMouseUp(event){
	$speed = 0.005;
	glitchPass.goWild = false;
	$enableMove= false;
	model.scale.set(1,1,1);
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 3000;		
	$body.removeClass('pressed');
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
		} 
	} 

	render();

}
function render() {

	var timer = -0.0002 * Date.now();
	//pointLight.position.x = 1500 * Math.cos( timer );
	//pointLight.position.z = 1500 * Math.sin( timer );
	if($enableMove){
		camera.position.x += ( mouseX - camera.position.x ) *2;
		camera.position.y += ( - mouseY - camera.position.y ) *2;
		//console.log((mouseX - camera.position.x ) * .05);
	}
	camera.lookAt( scene.position );

	composer.render( scene, camera );

}
