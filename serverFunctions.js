class serverFunctions{
    constructor(){
        this.numberOfPlayersInGame = 0
        
        this.serverElements = {
            players : [

            ],
            fruits : [

            ],
            power : [
                
            ]
        }

    }
    changeGamePlayerState(value){
        switch(value){
            case '+':{
                this.playersInGame = this.playersInGame + 1
                break;
            }
            case '-':{
                this.playersInGame = this.playersInGame - 1
                break;
            }
        }
    }
    addElement(element){
        if(element != undefined){
            switch(element.type){
                case 'fruit':{
                    this.serverElements.fruits.push(element.carac)
                    break;
                }
                case 'player':{
                    this.serverElements.players.push(element.carac)
                    break;
                }
                case 'power': {
                    this.serverElements.power.push(element.carac)
                }
            }
        }

        return{

        }
    }
    removeElement(elementID, type){
        switch(type){
            case 'player': {
                for(const element in this.serverElements.players ){
                    const player = this.serverElements.players[element];
                    
                    if(player.id == elementID){
                        delete this.serverElements.players[element];
                        console.log(this.serverElements.players)
                    }
                }  
                break;
            }
            case 'fruit':{
                for(const element in this.serverElements.fruits ){
                    const fruits = this.serverElements.fruits[element];
                    
                    if(fruits.id == elementID){
                        delete this.serverElements.fruits[element];
                    }
                }
                break;
                
            }
        }

        return{

        }
    }
    move(id, move){
        for(const element in this.serverElements.players){
            const player = this.serverElements.players[element];
            if(player != null && player != undefined){
                
                if(player.id == id){
                    console.log(move)
                    switch(move){
                        case 'ArrowDown':{
                            if(this.rules(player.location.y + 1) == true){
                                player.location.y = player.location.y + 1
                            }
                            break;
                        }
                        case 'ArrowUp': {
                            if(this.rules(player.location.y - 1) == true){
                                player.location.y = player.location.y - 1
                            }

                            break;
                        }
                        case 'ArrowLeft':{
                            if(this.rules(player.location.x - 1) == true){
                                player.location.x = player.location.x - 1
                            }

                            break;
                        }
                        case 'ArrowRight':{
                            if(this.rules(player.location.x + 1) == true){
                                player.location.x = player.location.x + 1
                            }

                            break;
                        }
                    };
                };
            };
        };
    };
    rules(location){
        if(location != 10 && location != -1){
            return true 
        }
        return false
    }
    fruitKnock(){
        for(const element_fruit_location in this.serverElements.fruits){
            const fruit = this.serverElements.fruits[element_fruit_location];
            for(const element_player_location in this.serverElements.players){
                const player = this.serverElements.players[element_player_location];
                if((player && fruit) != null){
                    if(player.location.x == fruit.location.x && player.location.y == fruit.location.y){
                        player.points = player.points + 1;
                        this.removeElement(fruit.id, 'fruit') 
                    }
                }
            }
        }
    }

}

export default serverFunctions;



