// Aqui vai todas as bibliotecas necessarias para funcionamento de um arduino e seus shields e modulos

/* 
#include <Wire.h>
#include "RTClib.h"
#include <LiquidCrystal_I2C.h>
#include matriz
RTC_DS1307 rtc;

LiquidCrystal_I2C lcd(0x3F,2,1,0,4,5,6,7,3, POSITIVE);

*/
let keypad = matriz;

let date = new Date();


const scripts = require('./Func/scripts');


function setup(){

  scripts.config();
  scripts.init();
};

function loop(){



  let percent = scripts.soloRead();

  let umidade = scripts.percent(percent);

  let eKeypad = keypad;

  let id = scripts.menu(eKeypad);

  scripts.irrigation(id,umidade);



};
