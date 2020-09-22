const socketHandler =(io)=>
{
    var users = [];
 

    io.on("connect", (socket) => {
      console.log("a user connected ");
      socket.on("register", (data) => {
        if (users[data.sender]) {
          users[data.sender].push(socket.id);
        } else {
          users[data.sender] = [socket.id];
        }
      });
      socket.on("message", function (data) {
        if (users[data.to]) {
          users[data.to].forEach(element => {
            socket.to(element).emit('message', { message: data.message, to: data.to, from: data.from })
    
          });
        }
        if (users[data.from]) {
          users[data.from].forEach(element => {
            socket.to(element).emit('message', { message: data.message, to: data.to, from: data.from })
    
          });
        }
      });
      socket.on("disconnect", () => {
        for (const key in users) {
          if (users.hasOwnProperty(key)) {
            const element = users[key];
            const index = element.indexOf(socket.id)
            if (index !== -1) {
              element.splice(index, 1)
    
            }
          }
        }
      });
    });   
}

module.exports = {socketHandler}