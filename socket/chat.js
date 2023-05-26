const openai = require("./openai/openai.js");
module.exports = function (io) {
  // Almacenar las salas y los usuarios conectados
  const rooms = {};
  const roomsAtendidos = {};
  const roomsBot = {};

  // Manejar la conexión de un usuario
  io.on("connection", (socket) => {
    function actualizarRooms() {

      // Obtener los nombres de los rooms
      const roomNames = Object.keys(rooms);

      // Crear un objeto para almacenar los últimos mensajes
      const lastMessages = {};

      // Recorrer cada room y obtener el último mensaje
      roomNames.forEach(roomName => {
        const roomMessages = rooms[roomName];
        const lastMessage = roomMessages[roomMessages.length - 1];
        lastMessages[roomName] = lastMessage;
      });

      // Emitir la lista de rooms y últimos mensajes al asesor
      io.emit("actualizarRooms", lastMessages);
    }

    // Manejar los mensajes enviados por un usuario
    socket.on("sendMessage", async (data) => {
      const { message, token } = data;

      // Si no hay sala, entrar a una sala personalizada con token
      if (!socket.roomBot) {
        const room = "bot" + token;
        socket.join(room);
        socket.roomBot = room;
        // Agregar el room que se creo e inicio el usuario para que el asesor lo vea
        roomsBot[socket.roomBot] = [];
      }

      if (message === "asesor") {
        // salir de la sala actual y unirse a la sala asesor
        socket.leave(socket.roomBot);
        // crea el room para luego comunicarse con el asesor

        // ELIMINAR ROOM BOT
        delete roomsBot[socket.roomBot];

        const room = "usuario" + token;
        socket.join(room);
        socket.room = room;
        socket.currentRoom = room;

        // Agregar el room que se creo e inicio el usuario para que el asesor lo vea
        rooms[socket.room] = [];

        // Mandarle al asesor la lista de usuarios en la sala
        actualizarRooms();
      }

      const date = new Date();
      const hora = date.getHours() + ":" + date.getMinutes();

      if (socket.room) {
        // Emitir el mensaje desde el usuario
        rooms[socket.room].push({ message, from: "user", hora });
        io.to(socket.room).emit("actualizarChat", rooms[socket.room]);
      } else {

        roomsBot[socket.roomBot].push({ message, from: "user", hora });
        io.to(socket.roomBot).emit("actualizarChat", roomsBot[socket.roomBot]);

        const respuestaOpenAI = await openai(message);

        if(respuestaOpenAI){
          roomsBot[socket.roomBot].push({ message: respuestaOpenAI, from: "bot", hora });
          io.to(socket.roomBot).emit("actualizarChat", roomsBot[socket.roomBot]);
        }

      }
      actualizarRooms();
    });

    // ver chat de room
    socket.on("verChat", (data) => {
      const { room } = data;
      // Si el asesor nunca había entrado a la sala, entrar (roomsAtendidos)
      if (
        !roomsAtendidos[room]
      ) {
        roomsAtendidos[room] = true;
        socket.join(room);
        // MAndar mensaje al usuario que el asesor entro a la sala
        rooms[room].push({
          message: "El administrador ha entrado al chat",
          from: "sistema",
        });
      }
      socket.join(room);
      io.to(room).emit("actualizarChat", rooms[room]);
    });

    // Chat del asesor
    socket.on("sendMessageAsesor", (data) => {
      const { message, room } = data;
      // Emitir el mensaje a todos los usuarios en la sala
      // hora actual formato 12:00
      const date = new Date();
      const hora = date.getHours() + ":" + date.getMinutes();

      rooms[room].push({ message, from: "asesor", hora });
      io.to(room).emit("actualizarChat", rooms[room]);

      actualizarRooms();
    });

    // cargar la lista de rooms
    socket.on("loadRooms", () => {
      actualizarRooms();
    });

    // Manejar la desconexión de un usuario
    /*     socket.on("disconnectUser", (data) => {
          const { room, tipo } = data;
    
          console.log("ENTRA A DISCONNECT USER");
          console.log("ROOMS", rooms);
          console.log("ROOM", room);
          console.log("TIPO", tipo);
    
          if (rooms > 0) {
            if (tipo === "usuario") {
              rooms[room].push({
                message: "El usuario ha abandonado en chat",
                from: "sistema",
              });
              io.to(room).emit("actualizarChat", rooms[room]);
            } else if (tipo === "asesor") {
              rooms[room].push({
                message: "El admimnistrador ha decido cerrar el chat",
                from: "sistema",
              });
              io.to(room).emit("actualizarChat", rooms[room]);
            }
          }
    
    
          // Eliminar room
          delete rooms[room];
    
          // Mandarle al asesor la lista de usuarios en la sala
          actualizarRooms();
        }); */

    // disconect
    socket.on("disconnect", () => {
      if (socket.currentRoom) {
        rooms[socket.currentRoom].push({
          message: "El usuario ha abandonado en chat",
          from: "sistema",
        });
        io.to(socket.currentRoom).emit("actualizarChat", rooms[socket.currentRoom]);
        actualizarRooms();
        delete rooms[socket.currentRoom];

        roomsAtendidos[socket.currentRoom] = false;
      }
    });
  });
};
