var container, stats, camera, scene, renderer, mesh, geometry, model, loader, pointLight, $wild;
$body = $('body');
$y = 0;
$m = 0;
$speed = 0.005;
mouseX = 0;
mouseY = 0;
angle = 0;
radius = 3000; 
$mesh = false;
$interior = false;
windowHalfX = window.innerWidth / 2;
windowHalfY = window.innerHeight / 2;
$enableMove= false;
$audio = false;
$playing = false;
$ie = false;
a = document.createElement('audio');
$audio = !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
isMobile = false;
$bg = 'home';
$about = 'about';
$contact = 'contact';
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
if(isMobile){
	$audio = false;
	$bg = 'home-mobile';
	$about = 'about-mobile';
	$contact = 'contact-mobile';
} 
path = "assets/images/cube/";
format = '.png';
urls = [
	path + $about + format, path + $contact + format,
	path + 'blank' + format, path + 'blank' + format,
	path + 'blank' + format, path + $bg + format
];
var jsonModelURL = [ 
    "assets/models/hv2.json",
];
if (document.documentMode || /Edge/.test(navigator.userAgent)) {
    $ie = true;    
}
if($audio){
	var audioContext = new(window.AudioContext || window.webkitAudioContext)(),
	    sampleBuffer, 
	    sound,
	    loop = true;
	var frequencyData;
	var analyser;
	if(!$ie){
		var analyser = audioContext.createAnalyser();
		analyser.fftSize = 32;
		var frequencyData = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(frequencyData);
	}
}
init();
animate();
$(document)
.on('mousemove', onDocumentMouseMove)
.on('mousedown touchstart', onDocumentMouseDown)
.on('mouseup touchend', onDocumentMouseUp);
$('#about-btn').click(function(e){
	onAboutClick(e);
	e.preventDefault();
});
$('#contact-btn').click(function(e){
	onContactClick(e);
	e.preventDefault();
});
$('#logo').mousedown(function(e){
	$interior=false;
	onDocumentMouseDown(e);
});
$('#mute').click(function(){
	if($body.hasClass('muted')){
		playSound();
		$body.removeClass('muted');
	} else{
		stopSound();
		$body.addClass('muted');
	}
});
function init() {
	if($audio){
		$body.addClass('audio');
		loadSound('assets/audio/loop.mp3');
	}
	container = document.createElement( 'div' );
	$(container).attr('id','bg');
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 3000;

	var reflectionCube = new THREE.CubeTextureLoader().load( urls );
	reflectionCube.format = THREE.RGBFormat;

	scene = new THREE.Scene();
	scene.background = reflectionCube;

	var ambient = new THREE.AmbientLight( 0xffffff , 1.2 );
	scene.add( ambient );

	pointLight = new THREE.PointLight( 0xffffff, 0.5 );
	scene.add( pointLight );

	var refractionCube = new THREE.CubeTextureLoader().load( urls );
	refractionCube.mapping = THREE.CubeRefractionMapping;
	refractionCube.format = THREE.RGBFormat;

	var cubeMaterial3 = new THREE.MeshLambertMaterial( { color: 0xff6600, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.3 } );
	var cubeMaterial2 = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: refractionCube, refractionRatio: 0.95 } );
	var cubeMaterial1 = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: reflectionCube } );

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
    var loader = new THREE.JSONLoader();
    loader.load(jsonModelURL[0], function( geometry ) { createScene( geometry, cubeMaterial2 ) });

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
	if(isMobile){
		var s = 300;
	} else{
		var s = 400;
	}

	var mesh = new THREE.Mesh( geometry, m2 );
	mesh.position.z = 0;
	mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
	model = new THREE.Object3D();
	model.add(mesh);
	model.rotation.set(0,0,0);
	scene.add(model);
	render();
}
function onDocumentMouseDown(event) {
	if($(event.target).attr('id') != 'about-btn' && $(event.target).attr('id') != 'contact-btn' && !$interior){
		glitchPass.Hits = 0.2;
		model.traverse( function ( object ) { object.visible = true; } );
		$speed = -.025;
		model.scale.set(6,6,6);
		$enableMove= true;
		$interior = false;
		$body.addClass('pressed');
		camera.position.z = 4000 * Math.cos( .01 );	
		glitchPass.goWild = true;
		if($audio && sound){sound.playbackRate.value = 0.7;}
		$body.removeClass('show-about');
		$body.removeClass('show-contact');
	}
}
function onAboutClick(event) {
	$tweenSpeed = 600;
	if($body.hasClass('show-contact')){
		$tweenSpeed = 1200;
	}
	$interior = true;
	$body.removeClass('show-about');
	$body.removeClass('show-contact');
	var tween1 = new TWEEN.Tween( model.scale ).to( { x:3,y:3,z:3 }, $tweenSpeed ).easing( TWEEN.Easing.Exponential.InOut );
	var tween2 = new TWEEN.Tween( camera.position ).to( { x:1500,y:0,z:10 }, $tweenSpeed ).easing( TWEEN.Easing.Exponential.InOut );
	glitchPass.goWild = false;
	$enableMove= false;
	$body.addClass('pressed');
	$body.addClass('show-about');
	tween1.start();
	tween2.start();
	tween2.onComplete(function() {
		if(!isMobile){
			$speed = 0;
		}
		$enableMove= true;
		$interior = true;
		glitchPass.goWild = false;
	});
}
function onContactClick(event) {
	$tweenSpeed = 600;
	if($body.hasClass('show-about')){
		$tweenSpeed = 1200;
	}
	$interior = true;
	$body.removeClass('show-about');
	$body.removeClass('show-contact');
	var tween1 = new TWEEN.Tween( model.scale ).to( { x:3,y:3,z:3 }, $tweenSpeed ).easing( TWEEN.Easing.Exponential.InOut );
	var tween2 = new TWEEN.Tween( camera.position ).to( { x:-1500,y:0,z:10 }, $tweenSpeed ).easing( TWEEN.Easing.Exponential.InOut );
	glitchPass.goWild = false;
	$enableMove= false;
	$body.addClass('pressed');
	$body.addClass('show-contact');
	tween1.start();
	tween2.start();
	tween2.onComplete(function() {
		if(!isMobile){
			$speed = 0;
		}
		$enableMove= true;
		$interior = true;
		glitchPass.goWild = false;
	});
}
function onDocumentMouseMove(event) {
	mouseX = ( event.clientX - windowHalfX )*3;
	mouseY = ( event.clientY - windowHalfY )*3;
	if($enableMove && $audio && sound && !$interior){
		glitchPass.goWild = true;
		sound.detune.value = ( event.clientY - windowHalfY )/2;
	} 
	e=event;
	pauseEvent(e);	
}
function pauseEvent(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
}
function onDocumentMouseUp(event){
	if($(event.target).attr('id') != 'about-btn' && $(event.target).attr('id') != 'contact-btn' && !$interior){
		$speed = 0.005;
		glitchPass.goWild = false;
		$enableMove= false;
		model.scale.set(1,1,1);
		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 3000;	
		model.rotation.x = 0;
		model.rotation.z = 0;
		$interior = false;	
		$body.removeClass('pressed');
		if($audio && sound){
			sound.playbackRate.value = 1;
			sound.detune.value = 0;
		}
	}
}
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
   	
	TWEEN.update();
	render();
}
function render() {
	var timer = -0.0002 * Date.now();
	if($mesh && $m > 2){
		if($interior){
			$amount = 0.000001;
		} else{
			$amount = 0.00001;
		}
		if(mouseX < 0){
			model.rotation.y -= (mouseX + model.rotation.y) * $amount;		
		} else{
			model.rotation.y -= (mouseX - model.rotation.y) * $amount;		
		}
	}
	if($enableMove){
		//console.log(camera.position.x);
		if(!isMobile){
			if($interior){
				//model.rotation.z = (mouseY - model.rotation.z) *0.001;
				//model.rotation.y = (mouseX - model.rotation.y) *0.001;
				//model.rotation.x = (mouseY - model.rotation.x) *0.001;
			} else{
				camera.position.x += ( mouseX - camera.position.x );
				camera.position.y += ( - mouseY - camera.position.y );
			}			
		}

	}
	camera.lookAt( scene.position );
	composer.render( scene, camera );
}
var sampleBuffer, sampleCount;

function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        audioContext.decodeAudioData(request.response, function (buffer) {
            var soundLength = buffer.duration;
			sampleBuffer = buffer;
			playSound(0);
			console.log(soundLength);
			$visualizer = setInterval(function(){
				if($audio && $playing){
					array = new Uint8Array(analyser.frequencyBinCount);
				    analyser.getByteFrequencyData(array); 
				    if(array[8] > 130){
					    if(!$enableMove && !$interior){
							glitchPass.goWild = true;
							$wild = setTimeout(function(){
								glitchPass.goWild = false;
							},150);
						} else if(!$interior){
							glitchPass.goWild = true;
							clearTimeout($wild);
						} else{
							glitchPass.goWild = false;
							clearTimeout($wild);			
						}
				    } 
				    $brightness = array[6]/100;
				    if($brightness < 0.75){
					    $brightness = 0.75;
				    }
				    pointLight.intensity = $brightness;
				    if(array[5] > 200){
					    if(!$enableMove && !$interior){
							model.traverse( function ( object ) { object.visible = false; } );
						}
						setTimeout(function(){
							model.traverse( function ( object ) { object.visible = true; } );
						},150);    
				    }
				    if(array[4] > 220){
					    if(!$enableMove && !$interior){
						    glitchPass.Hits = array[4]/100;
						} else{
							glitchPass.hits = 0.05;
						}
				    }
				    if(array[2] > 200){
					    if(!$enableMove && !$interior){
							model.rotation.x -= array[3]/100000; 
						} else{
							 //model.rotation.x = 0;
						}
				    } else{
					   model.rotation.x = 0;
				    }
				    if(array[0] > 245){
					    if(!$enableMove && !$interior){
							model.rotation.z += array[0]/100000; 
						}
				    } else{
					   //model.rotation.z= 0;
				    } 
				}
			});   
        });
    };
    request.send();
}
function setupSound() {
    sound = audioContext.createBufferSource();
    sound.buffer = sampleBuffer;
    sound.loop = loop;
    sound.loopStart = 0;
    sound.loopEnd = sampleBuffer.duration;
    sound.connect(audioContext.destination)
    sound.connect(analyser);
    analyser.connect(audioContext.destination);
	sound.playbackRate.value = 1;
}
function playSound(time) {
    setupSound();
	sound.start(time);
	$playing = true;
}
function stopSound() {
	$playing = false;
    sound.stop(0);
}

