const Stats = require('stats.js');
import { GUI } from 'dat.gui';

document.querySelector('.right-div').innerHTML = 
`<div class="m-2">
	<h2>Calculate FPS</h2>
    <div id="gui"></div>
	<h3>using stats.js</h3>
	<div id="id-stats"></div>
</div>
`;

var stats = new Stats();
var gui = new GUI();
document.querySelector('#gui').append(gui.domElement);
const params = {
	refreshRate: 60,
	frameTime_in_ms: 10,
	fps_rAF: 60,
	fps_rAF_avg: 60,
	fps_rAF_rIC: 60,
	fps_rAF_rIC_avg: 60,
	fps_performance: 60,
}

gui.add(params, 'refreshRate', 10, 200, 1).onChange((val:number) => {              
	refreshRate = val;         
});  
gui.add(params, 'frameTime_in_ms', 0, 50, 1).onChange((val:number) => {              
	frameTime = val;         
});
var fps_rAF = gui.add(params, 'fps_rAF');
var fps_rAF_avg = gui.add(params, 'fps_rAF_avg');
var fps_rAF_rIC = gui.add(params, 'fps_rAF_rIC');
var fps_rAF_rIC_avg = gui.add(params, 'fps_rAF_rIC_avg');
var fps_performance = gui.add(params, 'fps_performance');

stats.dom.style.cssText = 'position:relative;top:0;left:0';
document.querySelector('#id-stats').appendChild(stats.dom);

var refreshRate = 60;
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
var myfps = 0;

function updateLabel( fps: number) {
	if(!avgFps0) avgFps0 = mixedFps0;
	else {
		avgFps0 += 0.1 *(previousMixedFps0 - avgFps0);
	}
	previousMixedFps0 = mixedFps0;

	if(!avgFps) avgFps = mixedFps;
	else {
		avgFps += 0.1 *(previousMixedFps - avgFps);
	}
	previousMixedFps = mixedFps;
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
	const t0 = performance.now();
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
	requestIdleCallback( fpsCallback );
	requestAnimationFrame(animate);
	frame++;
	
	const t1 = performance.now();
	myfps = 1000/(t1 - t0);
	stats.end();
}
animate();
setInterval( function() {
	updateLabel(mixedFps);
	fps_rAF.setValue(fps0);
	fps_rAF_avg.setValue(avgFps0);
	fps_rAF_rIC.setValue(mixedFps);
	fps_rAF_rIC_avg.setValue(avgFps);
	fps_performance.setValue(myfps);
}, 200);
