const express = require('express');
const axios = require("axios")
const app = express();

app.set('port', process.env.PORT || 3001);

app.get('/', (req, res) => {
    res.send('Hello, Express')
});
// Http/Chunk 방식 테스트
app.get('/chat', async (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    //Setting HTTP/Chunk
    res.setHeader('Transfer-Encoding', 'chunked');
    try{
        const response = await axios({
            method: 'post',
            url: 'http://localhost:5001/chat',
            data: { message: "Hello AI!" },
            responseType: 'stream',
        });
        
        response.data.on('data', (chunk) => {
            console.debug("chunk::",chunk.toString())
            res.write(chunk.toString());
        });
    
        response.data.on('end', () => {
            console.debug("end");
            res.end();
        });
    }catch (error){
        console.error("/Chat Error",error);
        res.status(500).send('Failed to Request.');
    }
  
});

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기 중')
});