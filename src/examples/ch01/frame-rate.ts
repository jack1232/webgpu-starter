import * as Stats from 'stats.js';
import { GUI } from 'dat.gui';

document.querySelector('.right-div').innerHTML = 
`<div class="m-2">
	<h2>FPS and Rendering Time</h2>
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
}

let frameTime = 10;
gui.add(params, 'refreshRate');
gui.add(params, 'frameTime_in_ms', 0, 50, 1).onChange((val:number) => {              
	frameTime = val;         
});

stats.dom.style.cssText = 'position:relative;top:0;left:0';
document.querySelector('#id-stats').appendChild(stats.dom);

function sleep( ms: number ) {
	var t = performance.now();
	do{ }
	while( performance.now() - t < ms );
}

function animate() {
	stats.begin();
	const t0 = performance.now();
	sleep( frameTime );
	requestAnimationFrame(animate);
	stats.end();
}
animate();

