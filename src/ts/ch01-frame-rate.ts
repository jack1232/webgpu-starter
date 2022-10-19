const Stats = require('stats.js');

document.querySelector('.right-div').innerHTML = 
`<div class="m-2">
	<h2>Calculate FPS</h2>

	<label for="refresh">Enter your display refresh rate:</label>
	<input type="text" id="refresh" name="refresh" value="60" style="width:80px"><br><br><br>		
	<div><label>Set frame time: </label><input type="range" id="frameTime" min="0" max="50" value="10" style="width:200px">
	<span id="frameTimeLabel" class="ml-2">10</span> ms</div><br><br>

	<h3>using requestAnimationFrame only:</h3>
	<div style="color:red">FPS: <span id="fpsValue0" class="mr-3"></span> | <span class="ml-3">Avarage FPS:</span> <span id="avgFpsValue0"></div><br>

	<h3>using requestAnimationFrame and requestIdleCallback:</h3><br>	
	<div style="color:red">FPS: <span id="fpsValue" class="mr-3"></span> | <span class="ml-3">Avarage FPS:</span> <span id="avgFpsValue"></div><br>

	<h3>using stats.js</h3>
	<div id="id-stats"></div>
</div>
`;

var stats = new Stats();
stats.dom.style.cssText = 'position:relative;top:0;left:0';
var stats_div = document.querySelector('#id-stats').appendChild(stats.dom);

var fpsDiv0 = document.getElementById('fpsValue0');
var avgFpsDiv0 = document.getElementById('avgFpsValue0');
var fpsDiv = document.getElementById('fpsValue');
var avgFpsDiv = document.getElementById('avgFpsValue');
var refreshRate = parseFloat((document.getElementById('refresh') as HTMLInputElement).value);

var frame = 0;
var hasrICBeenCalledForThisFrame : any = null;

var frameTime = 10;
var avgFps0:any = null;
var avgFps:any = null;
var mixedFps0 = 0;
var previousMixedFps0 = 0;
var mixedFps = 0;
var previousMixedFps = 0;

var start = performance.now();
var fps = 0;
var fps0 = 0;
var rICFps = 0;

var frameTimeLabel = document.getElementById( 'frameTimeLabel' );
document.getElementById( 'frameTime' ).addEventListener( 'change', function( e ) {
	frameTime = (this as any).value;
	frameTimeLabel.textContent = frameTime.toString();
	
} );

function updateLabel( fps: number) {
	if(!avgFps0) avgFps0 = mixedFps0;
	else {
		avgFps0 += 0.1 *(previousMixedFps0 - avgFps0);
	}
	previousMixedFps0 = mixedFps0;
	fpsDiv0.textContent = fps0.toFixed(0).toString();
	avgFpsDiv0.textContent = avgFps0.toFixed(0).toString();

	if(!avgFps) avgFps = mixedFps;
	else {
		avgFps += 0.1 *(previousMixedFps - avgFps);
	}
	previousMixedFps = mixedFps;
	fpsDiv.textContent = fps.toFixed(0).toString();
	avgFpsDiv.textContent = avgFps.toFixed(0).toString();
}

function fpsCallback( d: any) {
	var goal = 1000 / refreshRate;
	var elapsed = goal - d.timeRemaining();
	rICFps = goal * refreshRate / elapsed;
	hasrICBeenCalledForThisFrame = true;	
}

function sleep( ms: number ) {
	var t = performance.now();
	do{ }
	while( performance.now() - t < ms );
}

function animate() {
	stats.begin();

	if(!document.getElementById('refresh')) return;
	refreshRate = parseFloat((document.getElementById('refresh') as HTMLInputElement).value);
	sleep( frameTime );

	var dt = performance.now() - start;
	if( dt > 1000 ) {
		fps0 = frame * 1000 / dt;
		fps = frame * 1000 / dt;
		frame = 0;
		start = performance.now();
	}

	mixedFps = hasrICBeenCalledForThisFrame ? rICFps : fps;
	mixedFps0 = fps0;

	hasrICBeenCalledForThisFrame = false;

	stats.end();
	requestIdleCallback( fpsCallback );
	requestAnimationFrame(animate);
	frame++;
}

animate();
setInterval( function() {
	updateLabel( mixedFps );
}, 200);





