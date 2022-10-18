document.querySelector('.right-div').innerHTML = 
`<div class="m-2">
	<h2>Calculate FPS</h2>

	<label for="refresh">Enter your display refresh rate:</label>
	<input type="text" id="refresh" name="refresh" value="60" style="width:80px"><br><br><br>		
	<div><label>Set frame time: </label><input type="range" id="frameTime" min="0" max="50" value="10" style="width:200px">
	<span id="frameTimeLabel" class="ml-2">10</span> ms</div><br><br>

	<h3>using requestAnimationFrame only:</h3>
	<div style="color:red">FPS: <span id="fpsValue0" class="mr-3"></span> | <span class="ml-3">Avarage FPS:</span> <span id="avgFpsValue0"></div><br>

	<h3>using requestAnimationFrame and requestIdleCallback:</h3>	
	<div style="color:red">FPS: <span id="fpsValue" class="mr-3"></span> | <span class="ml-3">Avarage FPS:</span> <span id="avgFpsValue"></div>
</div>
`;

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

// Deduce framerate based on remaining time per frame
// Goal is 60FPS - this should not be hardcoded!
function fpsCallback( d: any) {

	// Calculate the actual time the frame took
	// and the according FPS
	var goal = 1000 / refreshRate;
	var elapsed = goal - d.timeRemaining();
	rICFps = goal * refreshRate / elapsed;

	// Tell the FPS meter that we are over 60FPS
	hasrICBeenCalledForThisFrame = true;	
}

function sleep( ms: number ) {

	var t = performance.now();
	do{ }
	while( performance.now() - t < ms );

}

function render() {
	if(!document.getElementById('refresh')) return;
	refreshRate = parseFloat((document.getElementById('refresh') as HTMLInputElement).value);
	// Simulate some rendering code
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

	// Queue the call to render() for the next frame
	hasrICBeenCalledForThisFrame = false;
	requestIdleCallback( fpsCallback );
	requestAnimationFrame( render );
	frame++;
}


// Start rendering
render();
setInterval( function() {
	updateLabel( mixedFps );
}, 200);