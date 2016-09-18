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
var audioContext = new(window.AudioContext || window.webkitAudioContext)(),
    sampleBuffer, 
    sound,
    loop = true,
    pannner = audioContext.createStereoPanner();
var a = document.createElement('audio');
$audio = !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
init();
animate();


document.addEventListener('mousemove', onDocumentMouseMove, false);
//document.addEventListener('touchmove', onDocumentMouseMove, false);
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('touchstart', onDocumentMouseDown, false);
document.addEventListener('mouseup', onDocumentMouseUp, false);
document.addEventListener('touchend', onDocumentMouseUp, false);

$('#mute').click(function(){
	if($body.hasClass('muted')){
		loadSound('assets/audio/loop.mp3');
		$body.removeClass('muted');
	} else{
		sound.stop();
		$body.addClass('muted');
	}
})


function init() {
	if($audio){
		$body.addClass('audio');
		loadSound('assets/audio/loop.mp3');
	}
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 3000;

	//

	var path = "assets/images/cube/hv/";
	var format = '.png';
	var urls = [
			path + 'posx' + format, path + 'posx' + format,
			path + 'posx' + format, path + 'posx' + format,
			path + 'posx' + format, path + 'posz' + format
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
	if($audio){sound.playbackRate.value = 1;}
}
function onDocumentMouseMove(event) {
		mouseX = ( event.clientX - windowHalfX )*3;
		mouseY = ( event.clientY - windowHalfY )*3;
	if($enableMove && $audio){
		sound.detune.value = ( event.clientY - windowHalfY )/2;
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
	if($audio){
		sound.playbackRate.value = 0.25;
		sound.detune.value = 0;
	}
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
		camera.position.x += ( mouseX - camera.position.x );
		camera.position.y += ( - mouseY - camera.position.y );
		//camera.position.x = window.innerWidth * 12;
		//camera.position.z = 500;
		//console.log(camera.position.x +', '+camera.position.y);
	}
	camera.lookAt( scene.position );

	composer.render( scene, camera );

}
// function to load sounds via AJAX
function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function () {
        audioContext.decodeAudioData(request.response, function (buffer) {
            var soundLength = buffer.duration;
            sampleBuffer = buffer;
            //loopStart.setAttribute('max', Math.floor(soundLength));
            //loopEnd.setAttribute('max', Math.floor(soundLength));
            //playButton.disabled = false;
            //playButton.innerHTML = 'play';
            playSound();

        });
    };

    request.send();
}

// set our sound buffer, loop, and connect to destination
function setupSound() {
    sound = audioContext.createBufferSource();
    sound.buffer = sampleBuffer;
    sound.loop = loop;
    sound.loopStart = 0;
    sound.loopEnd = sampleBuffer.duration;
    //sound.detune.value = -1000;
    sound.connect(audioContext.destination);
	sound.playbackRate.value = 0.2;
}

// play sound and enable / disable buttons
function playSound() {
    setupSound();
    sound.start(0);

}
// stop sound and enable / disable buttons
function stopSound() {
    sound.stop(0);
}

// change playback speed/rate
function changeRate(rate) {
    sound.playbackRate.value = rate;
}

function loopOn(event){
    loop = event.target.checked;
    if(sound){ // sound needs to be set before setting loop points
        if(loop){
            loopStart.disabled = false;
            loopEnd.disabled = false;
        } else {
            loopStart.disabled = true;
            loopEnd.disabled = true;   
        }
    }
}

// change loopStart
function setLoopStart(start) {
    sound.loopStart = start;
}

// change loopEnd
function setLoopEnd(end) {
    sound.loopEnd = end;
}
/* ios enable sound output */
window.addEventListener('touchstart', function(){
	//create empty buffer
	var buffer = audioContext.createBuffer(1, 1, 22050);
	var source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(audioContext.destination);
	source.start(0);
}, false);