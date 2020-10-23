const fs = require('fs');
const http = require('http');
const url = require('url');
const port = process.env.PORT || 3000
const jsonobject = fs.readFileSync(`${__dirname}/data/data.json`,'utf-8');
const laptopdata = JSON.parse(jsonobject);


const server = http.createServer((req,res) => {
    const pathName = url.parse(req.url,true).pathname;
    const id = url.parse(req.url,true).query.id;
    console.log(req.url);
    //Routing
    if (pathName === "/products" || pathName === "/"){
        res.writeHead(200, {'Content-type': 'text/html'});
        fs.readFile(`${__dirname}/templates/template-overview.html` , 'utf-8' , (err , data) => {
                  let overviewoutput = data;
            fs.readFile(`${__dirname}/templates/template-cards.html` , 'utf-8' , (err , data) => {
                    
                const cardsoutput = laptopdata.map( el => replaceTemplate(data,el)).join(' ');
                
                overviewoutput = overviewoutput.replace('{%CARDS%}' , cardsoutput);
                   
                res.end(overviewoutput);
              });
            });
    } 
    else if(pathName === '/laptop' && id < laptopdata.length){
        res.writeHead(200, {'Content-type': 'text/html'});
        fs.readFile(`${__dirname}/templates/template-laptop.html` , 'utf-8' , (err , data) => {
        const output = replaceTemplate(data,laptopdata[id]);
              res.end(output);
        });
    }
    else if(pathName.includes('.jpg') || pathName.includes('.png')){
        fs.readFile(`${__dirname}/data/img${pathName}` , (err,data) => {
            res.writeHead(200, {'Content-type': 'image/jpg'});
            res.end(data);
        });
    }

    else {
        res.writeHead(404, {'Content-type': 'text/html'});
        res.end('URL you requested was not found on this server ');
    }

    

});
server.listen(port,() => {
    console.log('Server has started listening');
});


function replaceTemplate(originalHtml,laptopdata){
    let output = originalHtml.replace(/{%PRICE%}/gi , laptopdata.price);
    output = output.replace(/{%PRODUCTNAME%}/gi , laptopdata.productName);
    output = output.replace(/{%SCREEN%}/gi , laptopdata.screen);
    output = output.replace(/{%DESCRIPTION%}/gi , laptopdata.description);
    output = output.replace(/{%STORAGE%}/gi , laptopdata.storage);
    output = output.replace(/{%RAM%}/gi , laptopdata.ram);
    output = output.replace(/{%CPU%}/gi , laptopdata.cpu);
    output = output.replace(/{%IMAGE%}/gi , laptopdata.image);
    output = output.replace(/{%ID%}/gi , laptopdata.id);
   return output;
}
