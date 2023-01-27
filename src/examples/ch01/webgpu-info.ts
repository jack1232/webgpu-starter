import { checkWebGPUSupport } from '../../common/helper';

document.querySelector('.right-div').innerHTML = `
    <div class="m-5">
    <h3 style="line-height:10%;">Check whether your browser supports WebGPU</h3>
    <div id="id-result" style="line-height:10%;"></div>
    </div>
    <br />
`;

const getGPUInfo = async () => {
    const div = document.querySelector('#id-result') as HTMLDivElement;
    try{
        if(!navigator.gpu){
            div.style.lineHeight = "150%";
            div.innerHTML = checkWebGPUSupport;
            throw new Error(checkWebGPUSupport);
        }
        let ss = `<p>${Check WebGPU Support}</p>`;
        const adapter = await navigator.gpu.requestAdapter();
        const info = await adapter.requestAdapterInfo();

        ss += `<br/><h3>Adapter Info:</h3>
               <p>Vendor: ${info.vendor}</p>
               <p>Architecture: ${info.architecture}</p>`;

        ss += `<br/><h3>GPU Supported Limits:</h3>`;
        let i: keyof GPUSupportedLimits;
        for(i in adapter.limits){
            ss += `<p>${i}: ${adapter.limits[i]}</p>`;
        }        
        
        ss += `<br/><h3>GPU Supported Features:</h3>`;        
        adapter.features.forEach((x) =>{
            ss += `<p>${x}</p>`
        });

        div.innerHTML = ss;

    } catch(error:any) {
        throw new Error(error);
    }
}
getGPUInfo();
