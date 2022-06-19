//Aqui ficam as funções que modularizei para deixar o app mais limpo e facil de entendimento

/* *************************************************************************************************** */

//variaveis globais para uso nas funções:

const rele = 7;//esta esta difininco que o modulo de rele do arduino esta na porta digital 7

const higro = A0; //esta define o higrometro na porta analogica A0.

let arrayUmidade = [200]; //usando array para armazenar 200 leituras do higrometro ja que analogicos são muito sensiveis.

let date = new Date();

const db = require('../DB/db.json');

const Scripts = {

    config:()=>{ // Função que configura as portas e modulos do Arduino.

        Wire.begin();
	    rtc.begin();
	    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));  
	    pinMode(rele, OUTPUT);//rele
        lcd.begin(16,2);

    },

    init:()=>{  // Função que inicia o arduino e testa seus modulos

        lcd.setBacklight(HIGH);  
		lcd.setCursor(2,0);
		lcd.print("Carregando Sistema");
		delay(500);

		for ( i = 0; i < 8; i++) 
			{
    			lcd.scrollDisplayLeft();
    			delay(500);
    			i++;
			}

		lcd.setCursor(0,1);
		while(i<20)
		{
  			lcd.print("*");
  			delay(290);
  
			i++;

		}
		lcd.clear();

        // Leituras analogicas em arduino vão de 0 a 1023 se 0 ou maior que 1023 o higrometro esta com problema 
        if (higro !=0 && higro < 1023) {
            lcd.setCursor(0,1);
            lcd.print("Higrometro: ON")
        }
        else{
            lcd.setCursor(0,1);
            lcd.print("Higrometro: OF");
            lcd.setCursor(1,1);
            lcd.print("Verifique Higrometro");
        }

        //iniciando o rele que ativa a bomba d'agua desligado
        digitalWrite(rele,LOW);
        lcd.setCursor(1,1);
        lcd.print("Rele: ON")

        delay(1000);

        lcd.clear();

    },

    soloRead:()=>{//Função para ler a umidade do solo

        // Coloco os valores que o higrometro le do solo no array
        for(let i= 0; i< arrayUmidade.length; i++){
            arrayUmidade[i] = analogRead(higro);

        }

        // Faço a media dos valores armazenados para usar futuramente
        let result = arrayUmidade.reduce((soma, valor)=>{
            return (soma + valor)/arrayUmidade.length;

        })


        return result;
    },
       
    percent:(umidade)=>{//calculo para transofrmar a umidade do solo em %
        
        let x = ((umidade / 1023 * 100) - 100) * -1;
        
        let umidadePercent = Math.round(x);
        
        return umidadePercent;
    },
    
    menu:(escolha)=>{
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Pressione o numero da cultura que ira irrigar:");
        let keypad = escolha
        delay(2000);
        lcd.clear();
   
        switch (keypad) {
            case keypad = 1:
                lcd.setCursor(1,0);
                lcd.print(db[keypad-1].name);
                return JSON.parse(db[keypad-1].id);
                break;

            case keypad = 2:
                lcd.setCursor(1,0);
                lcd.print(db[keypad-1].name);
                return JSON.parse(db[keypad-1].id);               
            break;

            case keypad = 3:
                lcd.setCursor(1,0);
                lcd.print(db[keypad-1].name);
                return JSON.parse(db[keypad-1].id);                
            break;

            case keypad = 4:
                lcd.setCursor(1,0);
                lcd.print(db[keypad-1].name);
                return JSON.parse(db[keypad-1].id);               
            break;

            case keypad = 5:
                lcd.setCursor(1,0);
                lcd.print(db[keypad-1].name);
                return JSON.parse(db[keypad-1].id);               
            break;

            case keypad = 6:
                lcd.setCursor(1,0);
                lcd.print(db[keypad-1].name);
                return JSON.parse(db[keypad-1].id);                
            break;

            case keypad = 7:
                lcd.setCursor(1,0);
                lcd.print(db[keypad-1].name);
                return JSON.parse(db[keypad-1].id);                    
            break;

            case keypad = 8:
                lcd.setCursor(1,0);
                lcd.print(db[keypad-1].name);
                return JSON.parse(db[keypad-1].id);              
            break;

            case keypad = 9:
                lcd.setCursor(1,0);
                lcd.print(db[keypad-1].name);
                return JSON.parse(db[keypad-1].id); 
            break;

            case keypad = 10:
                lcd.setCursor(1,0);
                lcd.print(db[keypad-1].name);
                return JSON.parse(db[keypad-1].id);                
            break;
        
            default:
                break;
        }
    },

    irrigation:(id,umidade,)=> {//Tratamento logicos para ligar os espersores conforme necessidade
        let {nome, umidadeIdeal} = db[id-1];

        switch (umidade) {

            case umidade < umidadeIdeal:
                
	    	  lcd.clear();
              lcd.setCursor(0,0);
              lcd.print("Lig. Aspersores");
              delay(1000);
   
              digitalWrite(rele, HIGH);
   
              lcd.clear();
              lcd.print("Irrigando: " + nome);

            break;

            case (umidade + 5) >= umidadeIdeal || (umidadeIdeal -5) >= umidadeIdeal:
                digitalWrite(rele,LOW);
                 lcd.clear();
                 lcd.setCursor(0,0);
                 lcd.print(nome + " Esta na umidade ideal!!");
                    for (let i = 0; i < 30; i++) 
                         {
                             lcd.scrollDisplayLeft();
                             delay(500);
                              i++;
                          }
            break;


            case (umidade-umidadeIdeal) <= 6:
                digitalWrite(rele, LOW);        
                lcd.clear();
                lcd.setCursor(2,0);
                lcd.print("Solo Esta Saturado!!");
            break;
            
            default:
                break;
            }
            
            
    },

}

module.exports = Scripts;