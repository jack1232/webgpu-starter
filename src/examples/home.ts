const img = require('../assets/book01.png');

document.querySelector('.right-div').innerHTML = `
    <div style="text-align:center;">
        <h1>Example Projects for the Book</h1>
        <h3 style="color:red">For details about this book, please visit 
            <a href="https://drxudotnet.com">https://drxudotnet.com</a></h3>   
        <a href="https://drxudotnet.com"><img src=${img} width="400" height="492"></a>
    </div>  
`;