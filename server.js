const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));
app.use("/photos", express.static("photos"));

io.on("connection", (socket) => {

console.log("User connected");

socket.on("photo", (data) => {

const base64Data = data.image.replace(/^data:image\/jpeg;base64,/, "");

const folder = `photos/${data.user}`;

if (!fs.existsSync(folder)){
fs.mkdirSync(folder, { recursive: true });
}

const fileName = `${folder}/photo-${Date.now()}.jpg`;

fs.writeFile(fileName, base64Data, 'base64', function(err) {

if(!err){
io.emit("live-photo", data);
console.log("Saved:", fileName);
}

});

});

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
console.log("Server running");
});
