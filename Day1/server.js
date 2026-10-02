const http = require('http');
const server = http.createServer((req,res)=>{
    res.end(" Working Properly ")
})
server.listen(3000,()=>{
    console.log('Server ban gya h')
})