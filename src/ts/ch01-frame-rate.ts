document.querySelector('.right-div').innerHTML = 
`<div class="m-2">
	<h2>Check FPS</h2>
	<h3>using requestAnimationFrame and requestIdleCallback</h3>
	<label for="refresh">Enter your display refresh rate:</label>
	<input type="text" id="refresh" name="refresh" value="60"><br><br>

	<div>FPS: <span id="fpsValue"></span></div>
	<div>Avarage FPS: <span id="avgFpsValue"></span></div>
	<input type="range" id="frameTime" min="0" max="30" value="10">
	<div><span id="frameTimeLabel">10</span> ms</div>
</div>
`;

var fpsDiv = document.getElementById('fpsValue');
var avgFpsDiv = document.getElementById('avgFpsValue');
var refreshRate = parseFloat((document.getElementById('refresh') as HTMLInputElement).value);

var frame = 0;
var hasrICBeenCalledForThisFrame : any = null;

var frameTime = 10;
var avgFps:any = null;
var mixedFps = 0;
var previousMixedFps = 0;

var frameTimeLabel = document.getElementById( 'frameTimeLabel' );
document.getElementById( 'frameTime' ).addEventListener( 'change', function( e ) {
	frameTime = (this as any).value;
	frameTimeLabel.textContent = frameTime.toString();
	
} );

function updateLabel( fps: number) {
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

var start = performance.now();
var fps = 0;
var rICFps = 0;

function render() {
	if(!document.getElementById('refresh')) return;
	refreshRate = parseFloat((document.getElementById('refresh') as HTMLInputElement).value);
	// Simulate some rendering code
	sleep( frameTime );

	var dt = performance.now() - start;
	if( dt > 1000 ) {
		fps = frame * 1000 / dt;
		frame = 0;
		start = performance.now();
	}

	mixedFps = hasrICBeenCalledForThisFrame ? rICFps : fps;

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