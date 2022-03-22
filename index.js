
const data = {
    "amount": 720,
    "banknotes": {
        "5000": 38,
        "2000": 3,
        "1000": 132,
        "500": 95,
        "200": 0,
        "100": 4
    }
};
const URL = 'http://46.146.229.182/vk-test/bank.json';
let requestVK = new XMLHttpRequest();
requestVK.open('GET', URL);
requestVK.responseType = 'json';
requestVK.send();

const limitsNew = data.banknotes; 
const summNedeed = data.amount;
const btn = document.querySelector('.getMoney');
const textOnScreen = document.querySelector('.screen');
const summa = document.querySelector('.summ');

let getMoney = (amountReq,limits) => {
    const nominals = Object.keys(limits).map(Number); 
    nominals.sort(function(a, b) {
    return b-a;
    }); 
    
   function collect(amount,nominals){
    if(!nominals.length) return;
    if(amount%100 !==0) {
        return
    }
    if(amount===0) return {};
 
    let currentMaxNominal = nominals[0]; 
    let available = limits[currentMaxNominal]; 
    let notesNedeed = Math.floor(amount/currentMaxNominal);
    let numberOfNotes = Math.min(available,notesNedeed); 

    for (let i = numberOfNotes; i >= 0; i--) {
        let result = collect(amount - numberOfNotes * currentMaxNominal, nominals.slice(1));
        if(result){
            return i ? {[currentMaxNominal]:i,...result} : result
        }
        return {[currentMaxNominal]:i,...result}
       }
    }
   return collect(amountReq,nominals)
}

let dataForScreen = getMoney(summNedeed,limitsNew);



function onScreen(){
    if(dataForScreen){
        let banknotes = Object.keys(dataForScreen);
        let banknotesValue = Object.values(dataForScreen);

        for(let i = 0;i<banknotes.length;i++){
            let paragraph = document.createElement('p');
            paragraph.textContent = banknotes[i] + ' ' + '$' + ' ' + 'х' + ' ' + banknotesValue[i];
            paragraph.classList.add('banknotes');
            textOnScreen.appendChild(paragraph)
        }
    }else{
        textOnScreen.insertAdjacentHTML('afterbegin','<p>Введите сумму кратную 100  &#128549;</p>');
    }
}


btn.addEventListener('click',onScreen)