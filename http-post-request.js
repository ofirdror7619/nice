const http = require ('http');

function postReq(obj, destinationPort, destinationPath) {
    const options = {
      hostname: 'localhost',
      port: destinationPort,
      path: '/' + destinationPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(obj)
      }
    };
    
    const req = http.request(options, (response) => { 
      let data = '';
    
      response.on('data', (chunk) => {
        data += chunk;
      });
    
      response.on('end', () => {
        console.log(data);
      });
    });
    
    req.on('error', (error) => {
      console.error(`Error: ${error.message}`);
    });
    
    req.write(obj);

    req.end();
}

module.exports = { postReq };
