var http = require('http');
var fs = require('fs');
var server = http.createServer(function(req, res){
    if (req.url === "/") {
        res.writeHead(200, {'Content-Type': 'text/html'});
        var stream = fs.createReadStream('./index.html');
        stream.pipe(res);
    } else if (req.url === "/script.js") {                         
        contents = fs.readFileSync("./script.js", "UTF-8"); 
        res.end(contents);                                                 console.log("just sent the js file!"); 
    }
}).listen(3000, function(){
    console.log("Server running");
});
var io = require('socket.io')(server);

io.on('connection', function extractPDF(socket){
    console.log('a user connected');
    socket.on('event', function() {
        console.log ('I have received a request!');
        var pdf_extract = require('pdf-extract');
        var path = require('path');
        var absolute_path_to_pdf = path.join(process.env.HOME, '/Desktop/a.pdf');
        var options = {
            type: 'text' 
        };
        var processor = pdf_extract(absolute_path_to_pdf, options, function(err) {
            if (err) {
                return io.emit(err);
            }
        });
        processor.on('page', function(data) {
            io.emit("progress", data.index);
        });
        processor.on('complete', function(data) {
            io.emit("data", data.text_pages);
        });
        processor.on('error', function(err) {
            return io.emit(err);
        });
    });
    socket.on('disconnect', function(){
        console.log("disconnected");
    });
});

