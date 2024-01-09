let usermode = 'visitor';
let gamerunning = false;
let gamestarted = false;
let n_of_scenarios = 2;
let scenario = 0;
let gametime = 1;
let apps = [];
let pin = 5555;
let commandshistory = [];
let isTestMode = false;


function start(){
    console.log('DEV: function start() called');
    document.getElementById('command_prompt').focus();
    scenario = Math.floor(Math.random() * n_of_scenarios) + 1;
    console.log('DEV: scenario ' + scenario + ' selected');
    document.getElementById('username').innerHTML = usermode;
    let input= document.getElementById('command_prompt');
    let output= document.getElementById('history');
    pregame(input, output);
}

function pregame(input, output){
   
    output.innerHTML = '';
    output.innerHTML += 'CyberGame v0.1 <br>';
    output.innerHTML += 'Vítej ve hře!<br> Můžeš zadat příkaz "start" pro začátek hry, "help" pro nápovědu<br>';
    console.log('DEV: function pregame() called');
    document.getElementById('command_prompt').focus();
    if(gamestarted === true){
        return;
    }
    input.addEventListener('keyup', function(event){
        if(event.keyCode === 13){
            processCommand(input, output);
            console.log('enter pressed');
        }
    });
    
}

function processCommand(input, output){
    let command = input.value;
    let commandArray = command.split(' ');
    console.log
   if(gamestarted === true){
         game(input, output);
    }else
    if(gamestarted === false){
        commandshistory.push(command);
        if(commandshistory.length > 10){
            commandshistory.shift();
        }

    
        
    switch(command){
        case 'start':
            output.innerHTML += 'Nekompletní příkaz: zadej obtížnost ("start hard" nebo "start easy")<br>';
            break;
        case 'start hard':
            output.innerHTML += '';
            input.value = '';
            usermode = 'user';
            timer(input, output, 600);
            break;
        case 'start easy':
            output.innerHTML += '';
            input.value = '';
            usermode = 'user';
            timer(input, output, 900);
            break;
        case 'start test':{
           output.innerHTML += '';
            input.value = '';
            usermode = 'user';
            timer(input, output, 600);
            scenario = 1;
        }break;
        case 'credits':
            output.innerHTML += 'Hru vytvořil: <br> Adam Czech a Martin Kraus pro vzdělávací účely v rámci SOČ v roce 2023<br>';
            break;  
        case 'clear':
            output.innerHTML = '';
            break;
        case 'help':
            output.innerHTML += 'Příkazy:<br> start - začne hru<br> credits - zobrazí autory<br> clear - smaže historii<br> help - zobrazí nápovědu<br>';
            break;
        default:
            output.innerHTML += 'Neznámý příkaz: "' + command + '"<br>';
            break;
    }}    
    input.value = '';
   

    

    
}

function timer(input, output, maxtime){
    if(gamerunning === true){
        return;
    }
    commandshistory = [];
    usermode = 'user';
    let time = maxtime;
    let refresh = setInterval(function(){
        time--;
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        gametime = time;
        if(time <= 0){
            document.getElementById('timer').innerHTML = '--:--';
            clearInterval(refresh);
            input.value = '';
            end(input, output);

        }    }, 1000);
    setInterval(function(){
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        if(seconds < 10){
            seconds = '0' + seconds;
        }
        document.getElementById('timer').innerHTML = minutes + ':' + seconds;
    }
    , 1000);


    gamerunning = true;
    gamestarted = true;
    output.innerHTML = '';
     //scenarios
     switch(scenario){
        case 1:{
            usermode = 'user';
            output.innerHTML += 'Bruteforce hesla:<br>Tvým úkolem bude se dostat do špatně zabezpečného PC, tušíš, že heslo je 4 znaky dlouhé a obsahuje pouze číslice.<br>';
            pin = Math.floor(Math.random() * 9000) + 1000;
            
        }break;
        case 2:{
            usermode = 'user';

            output.innerHTML += 'Crackování WiFi Hesla:<br> Tvým úkolem je zjistit heslo od Wifi sítě, která používá zastaralé šifrování.<br> Podařilo se ti uložit handshake packet do složky /var/hanshakes/wlan1.pcap<br> Nápověda: využij známé slabiny WEP šifrování, abys získal hash.<br>';
    }
    game(input, output);
}
}

function end(input, output){
    gamestarted = false;
    gamerunning = false;
    output.innerHTML += 'Čas vypršel.<br>';
    console.log('game ended');
    processCommand(input, output);
    return;
}

function success(input, output){
    gamestarted = false;
    gamerunning = false;
    output.innerHTML += 'Skvěle! Podařilo se ti dostat do PC!<br>';
    console.log('game ended');
    input.value = '';
    pregame(input, output);

}
function game(input, output){

    if(gametime <= 0){
        document.getElementById('timer').innerHTML = '--:--';
        gametime = 0;
        end(input, output);
    }
    document.getElementById('username').innerHTML = usermode;
    console.log('DEV: function game() called');
    if(gamestarted === false){
        return;
    }
    let command = input.value;
    let commandArray = command.split(' ');
    
    commandshistory.push(command);
    if(commandshistory.length > 10){
        commandshistory.shift();
    }

    let commandIndex = commandshistory.length;

    window.addEventListener('keydown', function(event){
        if(event.key == 'ArrowUp'){
            if(commandIndex > 0) {
                commandIndex--;
            }
            input.value = commandshistory[commandIndex] || '';
        }
    });
    
    window.addEventListener('keydown', function(event){
        if(event.key == 'ArrowDown'){
            if(commandIndex < commandshistory.length - 1) {
                commandIndex++;
            }
            input.value = commandshistory[commandIndex] || '';
        }
    });
    switch(commandArray[0]){
        //commands for all modes
        case 'clear':
            output.innerHTML = '';
        break;
        case 'root': 
            changeusermode('root');
        break;
        case 'user':
            changeusermode('user');
        break;
        case 'sudo':
            changeusermode('root');
        break;

        case 'login':{
            switch(commandArray[1]){
                case pin.toString():{
                    success(input, output);
                }break;
                case undefined:{
                    output.innerHTML += 'login: missing argument<br>';
                }break;
                default:{
                    output.innerHTML += 'login: ' + commandArray[1] + ': pin is not correct!<br>';
                }break;

            }
        }break;
        
        //usermode commands
        default:{
            switch(usermode){
                //user commands
                case 'user':{
                switch(commandArray[0]){
                   case 'sudo':{
                          switch(commandArray[1]){
                            case 'su':{
                                 switch(commandArray[2]){
                                      case 'root':{
                                        changeusermode('root');
                                      }break;
                                      case '-':{
                                        changeusermode('root');
                                      }break;
                                      case undefined:{
                                        output.innerHTML += 'sudo: su: missing argument<br>';
                                        }break;
                                      default:{
                                        output.innerHTML += '[sudo] Unknown user: ' + commandArray[2] + '<br>';
                                      }break;
                                 }
                            }break;
                            case undefined:{
                                output.innerHTML += 'sudo: missing argument<br>';
                            }break;
                            default:{
                                 output.innerHTML += 'sudo: ' + commandArray[1] + ': command not found<br>';
                            }break;
                          }
                   }break;
                }}break;
                case 'root':{
                    switch(commandArray[0]){
                        case 'apt':{
                            switch(commandArray[1]){
                                case 'install':{
                                    switch(commandArray[2]){
                                       case 'cracker':{
                                            installApp('cracker');
                                       }break;
                                       default:{
                                             output.innerHTML += 'apt: install: ' + commandArray[2] + ': package not found<br>';
                                        }break;
                                    }
                                }break;

                                default:{
                                    output.innerHTML += 'apt: ' + commandArray[1] + ': command not found<br>';
                                }break;
                            }
                        }break;
                        
                        case 'cracker':{
                            if(apps.includes('cracker') === false){
                                output.innerHTML += 'cracker: unknown command<br>';
                            }else{
                            output.innerHTML += '<img src="https://i.imgur.com/R7oUFvp.png"><br>';
                            switch(commandArray[1]){
                                case 'bruteforce':{
                                    switch(commandArray[2]){
                                        case 'pin':{
                                           if(commandArray[3] === undefined){
                                               output.innerHTML += 'cracker: bruteforce: missing argument<br>';
                                               break;
                                            }
                                            if(commandArray[3]=== '4'){
                                                output.innerHTML += 'cracker: bruteforce: Loading';
                                                let i = 0;
                                                var refresh = setInterval(function(){
                                                    i++;
                                                    if(i > 6){
                                                        i = 0;
                                                        clearInterval(refresh);
                                                         
                                                    }
                                                    output.innerHTML += '.';
                                                }
                                                , 500);
                                                setTimeout(function(){
                                                    output.innerHTML += '<br>cracker: bruteforce: pin is: ' + pin + '<br>';
                                                    clearInterval(refresh);
                                                }, 4000);
                                                    
                                            }
                                            
                                        }break;
                                    }
                                }break;
                                default:{
                                    output.innerHTML += 'cracker: ' + commandArray[1] + ': command not found<br>';
                                }break;
                            }
                            }
                        }break;      
                       
                        case 'exit':{
                            usermode = 'user';
                            console.log('DEV: user became user');
                            document.getElementById('username').innerHTML = usermode;
                            document.getElementById('command_prompt').focus();
                        }break;
                        
                        default:{
                            output.innerHTML += 'command not found: ' + commandArray[0] + '<br>';
                        }break;

                    }}break; 
                    default:{
                        output.innerHTML += 'command not found: ' + commandArray[0] + '<br>';
                    }break;
            }
            
        }break;
        
       

    }
   
}

function changeusermode(username){
    console.log('DEV: function changeusermode() called');
    document.getElementById('command_prompt').focus();
    if(username === usermode){
        return;
    }
    switch(username){
       case 'root':{
        document.getElementById('history').innerHTML += '[root] password for root:<br>';
        document.getElementById('command_prompt').value = '';
        document.getElementById('command_prompt').type = 'password';
        document.getElementById('command_prompt').focus(); 
        document.getElementById('command_prompt').addEventListener('keyup', function(event){
            if(document.getElementById('command_prompt').value=='root'){
                usermode = 'root';
                console.log('DEV: user became root');
                document.getElementById('username').innerHTML = usermode;
                document.getElementById('command_prompt').type = 'text';
                document.getElementById('command_prompt').value = '';
                document.getElementById('command_prompt').focus();
                return;
            }
        });

    }break;
    
}
return;
}

function installApp(app){ 
    if(apps.includes(app)){
        document.getElementById('history').innerHTML += app + ' is already the newest version (0.1).<br>';
        return;
    }else{
    document.getElementById('history').innerHTML += 'Reading package list ... Done<br>';
    document.getElementById('history').innerHTML += 'Building dependency tree ... Done<br>';
    document.getElementById('history').innerHTML += 'Reading state information ... Done<br>';
    document.getElementById('history').innerHTML += 'The following additional packages will be installed:<br>';
    document.getElementById('history').innerHTML += '   '+ app +'-pckg <br>';
     setTimeout(function(){
        document.getElementById('history').innerHTML += 'Done!<br>';
        apps.push(app);
        
     }, 2000); 
    }

}
