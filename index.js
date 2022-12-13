let webSocket = new WebSocket('ws://localhost:7878/');

const disconnect = document.getElementById("button2");
disconnect.onclick = function testfunc(){
    webSocket.close();
    disconnect.disabled = true;
}
window.addEventListener('keypress',(keyevent)=>{
    if(!(webSocket == null)){
        webSocket.send(keyevent.key);
    }
})

webSocket.addEventListener('message', (sendevent) => {
        console.log('Message from server ', sendevent.data);
        document.getElementById("input").innerHTML += sendevent.data;
        if(sendevent.data == "Waiting for another player<br>"){
            document.getElementById("ans").innerHTML = ""
            document.getElementById("rock").innerHTML = ""
            document.getElementById("paper").innerHTML = ""
            document.getElementById("scissors").innerHTML = ""

        }
        if(sendevent.data.includes("connected to room:")){
            console.log("connected");
            document.getElementById("ans").innerHTML = ""
            document.getElementById("rock").innerHTML = "rock"
            document.getElementById("paper").innerHTML = "paper"
            document.getElementById("scissors").innerHTML = "scissors"
        }

        /*
         <div id="game">
      <br>
      <div id="ans">Pick an Option</div>
      <br>
      <button id="rock">Rock</button>
      <button id="paper">Paper</button>
      <button id="scissors">Scissors</button>
    </div>
        */
 
})

const rock = document.getElementById("rock");
const paper = document.getElementById("paper");
const scissors = document.getElementById("scissors");

function select(input){
    input.onclick= () =>{
        rock.disabled =true
        paper.disabled =true
        scissors.disabled =true
        const answer = document.getElementById("ans");
        switch (input) {
            case rock:
                    answer.innerHTML = "You Chose Rock";
                    webSocket.send("rock");
                break;
            case paper:
                answer.innerHTML = "You Chose Paper";
                webSocket.send("paper");
            break;
            case scissors:
                answer.innerHTML = "You Chose Scissors";
                webSocket.send("scissors");
            break;
        
            default:
                break;
        }
    }
}

select(rock)
select(paper)
select(scissors)