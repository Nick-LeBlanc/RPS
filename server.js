const { Console } = require('console');
const { randomUUID } = require('crypto');
const express = require('express')
const app = express()
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const port = 3000

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile('./idnex.html', { root: __dirname });
})

app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}/`)
})

const { Server } = require('ws');
const dec = new TextDecoder("utf-8");
const sockserver = new Server({ port: 7878 });
const connections = new Set();

class room{
  constructor({id, player1, player2}){
    this.id=id;
    this.player1=player1;
    this.player2=player2;
    this.points1 = 0;
    this.points2 = 0;

    player1.send(`connected to room: ${this.id} <br>`);
    player2.send(`connected to room: ${this.id} <br>`);
  }

  write(){
    this.player1.on('message', (data) => {
     this.player2.send(dec.decode(data))
    });
    this.player2.on('message', (data) => {
      this.player1.send(dec.decode(data))
     });
  }

  close(){
    this.player1.on('close', () => {
      connections.delete(this.player1);
      connections.delete(this.player2);
      this.player2.send("<br>the other player left")
    });
    this.player2.on('close', () => {
      connections.delete(this.player1);
      connections.delete(this.player2);
      this.player1.send("<br>the other player left")
    });
    if(!connections.has(this.player1) || !connections.has(this.player2)){
      rooms.delete(this);
    }
  }

  async gameloop(){
    
    let choice1 = await this.getChoice(this.player1);
    let choice2 = await this.getChoice(this.player2);

    this.player1.on('message', (data) => {
      if(choice1 !== undefined){
        console.log(choice1);
        return;
      }else{
        console.log(choice2);
        return;
      }
     });

     this.player2.on('message', (data) => {
      if(choice2 !== undefined){
        console.log(choice2);
        return;
      }else{
        console.log(choice1);
        return;
      }
     });

     
    // this.player1.on('message', (data) => {
    //     console.log(choice2, choice1);
    //     return;
    //  });


  }

  async getChoice(player){
      await player.on('message', (data) => {
        let choice = dec.decode(data);
        if(choice =="rock" || choice =="paper" || choice =="scissors" ){
          return choice;
        }
       });
  }

}
const rooms = new Set();

sockserver.on('connection', (ws) => {
  connections.add(ws)
  if(connections.size % 2 == 0 ){
    rooms.add(new room({
      id:randomUUID(),
      player1: Array.from(connections)[connections.size - 1],
      player2: Array.from(connections)[connections.size - 2]
    }));

  }else{
    // console.log("player connected");
    ws.send("Waiting for another player<br>");
    ws.on('close', () => {
      connections.delete(ws);
    });
  }

  rooms.forEach((newRoom) =>{
    newRoom.gameloop();
    newRoom.close();
  });
 
   ws.on('close', () => {
       connections.delete(ws);
       console.log('Client has disconnected!');
   });
});