import socketio from 'socket.io'
import express from 'express'
import http from 'http'
import serverFunctions from './serverFunctions.js'
const app = express()
const port = 3000
const server = http.createServer(app);
const sockets = socketio(server)
const functions = new serverFunctions;  
class initServers{
  constructor(){
    this.playersOnWait = 0 
    this.necessaryPlayersOnMatch = 1 
    this.maxPoints = 3
    this.users = []
    this.integer = 0
 
    app.get('/', (req, res) => {
      res.sendFile('/Mateus/Projetos/Games/Web/Game3/public/index.html');
    });
    this.init();
  }
  init(){
 

    sockets.on('connection', (socket) => {
      socket.emit('playerNick', socket.id)
      socket.on('nameReceive', (content) => {
        this.users.push({socketId : socket.id, userId: content})
        console.log('user name captured')
      })
      socket.on('onGame', () => {
        
        functions.addElement({type: 'player', carac: { 
          id: socket.id,
          points: 0,
          location  : {
            x: Math.floor((10 - 0) * Math.random()), 
            y: Math.floor((10 - 0) * Math.random()) 
          } 
        }})

        this.playersOnWait++
        console.log(`${socket.id} on game screen \n `);
        if(this.playersOnWait > 1){
          sockets.emit('numberOfPlayers', {max: this.necessaryPlayersOnMatch,now:this.playersOnWait});
        }
 
        if(this.playersOnWait >= this.necessaryPlayersOnMatch){

          console.log(functions.serverElements.players)
          
          sockets.emit('gameStart')
          emitNewState(); 
          this.gameInit(socket); 
          
          setInterval(() => {    
            functions.addElement({type: 'fruit', carac: {
              id: 'fruit' + this.integer,

              location:{
                x: Math.floor((10 - 0) * Math.random()),
                y: Math.floor((10 - 0) * Math.random())
              }
            }})
            this.integer++ 
            emitNewState(); 
          }, 5000);
          
 
        };
        socket.on('move', (direction) => {
          console.log(socket.id)
          functions.move(socket.id, direction );
          functions.fruitKnock();
          emitNewState();
          const scoreboard = []
          for(const element in functions.serverElements.players){
            const player = functions.serverElements.players[element]
            const playerPoints = player.points;
            for(const id in this.users){
              const user = this.users[id]; 
              if(user.socketId == player.id){ 
                scoreboard.push({id: user.userId, points: playerPoints})
              }
            } 
          
          }
          sockets.emit('score', scoreboard);
          for(const el in scoreboard){
            const player = scoreboard[el];
            if(player.points >= this.maxPoints){
              sockets.emit('end', player)
            } 
          }
        

        });

        function emitNewState(){
           sockets.emit('gameContent', functions.serverElements)
        } 
        

        socket.on('disconnect', () => {
          this.playersOnWait = this.playersOnWait -1;
          functions.removeElement(socket.id, 'player')
          emitNewState();   
        }); 
      })


    });


  }
  gameInit(socket){


    console.log('init game...');

    console.log('updating requests');

  }
}



server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  const start = new initServers;
});