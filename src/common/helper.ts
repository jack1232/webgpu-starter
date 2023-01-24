export const hex2rgb = (hex:string) => {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16)/255.0);
    return new Float32Array([r, g, b, 1]);
}

export interface PipelineArgs {
    pipeline?: GPURenderPipeline;
    vertexBuffer?: GPUBuffer;
    normalBuffer?: GPUBuffer;
    colorBuffer?: GPUBuffer;
    uvBuffer?: GPUBuffer;
    uniformBuffer?: GPUBuffer;
    uniformBindGroup?: GPUBindGroup;
}

export interface InitArgs {
    device?: GPUDevice;
    context?: GPUCanvasContext;
    format?: GPUTextureFormat;
    size: {};
}

export const CreateGPUBuffer = (device:GPUDevice, data:Float32Array, 
    usageFlag:GPUBufferUsageFlags = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST) => {
    const buffer = device.createBuffer({
        size: data.byteLength,
        usage: usageFlag,
        mappedAtCreation: true
    });
    new Float32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();
    return buffer;
}

export const InitWebGPU = async (canvas: HTMLCanvasElement) => {
    if(CheckWebGPUSupport.includes('Your current browser does not support WebGPU!')){
        console.log(CheckWebGPUSupport);
        throw('Your current browser does not support WebGPU!');
    }
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();
    const context = canvas.getContext('webgpu') as GPUCanvasContext;
    const format = navigator.gpu.getPreferredCanvasFormat();
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * pixelRatio;
    canvas.height = canvas.clientHeight * pixelRatio;
    const size = {width: canvas.width, height: canvas.height};
    context.configure({
        device: device,
        format: format,
        alphaMode: 'opaque',
    });
    return {device, context, format, size} as InitArgs;    
}

export const CheckWebGPUSupport = navigator.gpu? 'Great, your current browser supports WebGPU!' : 
    `Your current browser does not support WebGPU! Make sure you are on a system 
    with WebGPU enabled. Currently, WebGPU is only supported in  
    <a href="https://www.google.com/chrome/canary/">Chrome canary</a>
    with the flag "enable-unsafe-webgpu" enabled. See the 
    <a href="https://github.com/gpuweb/gpuweb/wiki/Implementation-Status"> 
    Implementation Status</a> page for more details.`;