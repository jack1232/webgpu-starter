import shader from '../shaders/ch01-color-triangle.wgsl';
import { InitWebGPU, CreateGPUBuffer, InitArgs, PipelineArgs, hex2rgb } from './common/helper';
const dat = require('dat-gui');

document.querySelector('.right-div').innerHTML = 
`<canvas id="canvas-webgpu"></canvas>
 <div id="gui"></div> 
`;

const vertexData = new Float32Array([
    0.0, 0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0
]);

const createPipeline = async (device: GPUDevice, format: GPUTextureFormat ) => {
    const pipeline = await device.createRenderPipelineAsync({
        layout:'auto',
        vertex: {
            module: device.createShaderModule({                    
                code: shader
            }),
            entryPoint: "vs_main",
            buffers:[
                {
                    arrayStride: 4*3,
                    attributes: [
                        {
                            shaderLocation: 0,
                            format: 'float32x2',
                            offset: 0
                        },
                    ]
                }
            ]
        },
        fragment: {
            module: device.createShaderModule({                    
                code: shader
            }),
            entryPoint: "fs_main",
            targets: [
                {
                    format: format as GPUTextureFormat
                }
            ]
        },
        primitive:{
            topology: "triangle-list",
        }
    });

    const vertexBuffer = CreateGPUBuffer(device, vertexData);

    const colorData = new Float32Array([1,0,0,1]);
    const uniformBuffer = CreateGPUBuffer(device, colorData, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
    const uniformGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: uniformBuffer
                }
            }
        ]
    });

    return {
        pipeline: pipeline,
        vertexBuffer: vertexBuffer,
        uniformBuffer: uniformBuffer,
        uniformBindGroup: uniformGroup
    } as PipelineArgs;
}

const draw = (i: InitArgs, p: PipelineArgs ) => {
    const commandEncoder =  i.device.createCommandEncoder();
    const textureView = i.context.getCurrentTexture().createView();
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: textureView,
            clearValue: { r: 0.5, g: 0.5, b: 0.8, a: 1.0 }, //background color
            loadOp:'clear',
            storeOp: 'store'
        }]
    });
    renderPass.setPipeline(p.pipeline);
    renderPass.setVertexBuffer(0, p.vertexBuffer);
    renderPass.setBindGroup(0, p.uniformBindGroup);
    renderPass.draw(3);
    renderPass.end();
    i.device.queue.submit([commandEncoder.finish()]);
}

const run = async () => {
    const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement;
    const i = await InitWebGPU(canvas);
    const p = await createPipeline(i.device, i.format);
    draw(i, p);

    // update color
    var gui = new dat.GUI();
    document.querySelector('#gui').append(gui.domElement);
    const params = {
        color: '#ff0000',
    };
    gui.addColor(params, 'color').onChange(function(color:any){
        i.device.queue.writeBuffer(p.uniformBuffer, 0, hex2rgb(color));
        p.uniformBuffer = p.uniformBuffer;
        draw(i, p);
    });
    
    // resize
    window.addEventListener('resize', () => {
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * pixelRatio;
        canvas.height = canvas.clientHeight * pixelRatio;
        draw(i, p);
    })
}

run();



