const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyMsg = document.querySelector('[data-copyMsg]');
const copyBtn = document.querySelector('[data-copyBtn]');

const inputSlider = document.querySelector('[data-lengthSlider]');
const lengthDisplay = document.querySelector('[data-lengthNumber]');

const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');

const indicator = document.querySelector('[data-indicator]');

const generateBtn = document.querySelector('.generate-Btn');

const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const symbols = '~`!@#$%^&*()-_=+{[}]|;:"<,.>?/';

let passwordLength = 10;
handleSlider();
// strength circle color to grey.
setIndicator("#ddd");
// set password length.

// for slider color refer: https://stackoverflow.com/questions/18389224/how-to-style-html5-range-input-to-have-different-color-before-and-after-slider
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.textContent = passwordLength;

    // slider background color.
    const min = inputSlider.min;
    const max = inputSlider.max;
    // inputSlider.style.backgroundSize = ( (passwordLength - min )* 100 / ( max - min) ) + "% 100%";  // not working.
    inputSlider.style.background = `linear-gradient(to right, #0E61DE 0%, #0E61DE ${(passwordLength-min)/(max-min)*100}%, #261263 ${(passwordLength-min)/(max-min)*100}%, #261263 100%)`
    console.log(inputSlider.style.backgroundSize);
}

function getRandomInt(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

// random number generator
function generateRandomNumber(){
    return getRandomInt(0,9);
}
// random uppercase charactor generator
function generateUpperCase(){
    return  String.fromCharCode(getRandomInt(65,91));
}
// random lowercase charactor generator
function generateLowerCase(){
    return  String.fromCharCode(getRandomInt(97,123));
}
// random symbols generator
function generateSymbols(){
    const randomNum = getRandomInt(0,symbols.length);
    return  symbols.charAt(randomNum);
}

// password generator
function genereatePassword(){
    let characters="";
    if(uppercaseCheck.checked){
        characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if(lowercaseCheck.checked){
        characters += "abcdefghijklmnopqrstuvwxyz";
    }
    if(numbersCheck.checked){
        characters += "0123456789";
    }
    if(symbolsCheck.checked){
        characters += "~`_-=+|]}{[;:,<.>/?";
    }
    let counter = parseInt(lengthDisplay.textContent);
    let length = characters.length;
    let result;
    while (counter--) {
        let temp = parseInt(Math.random()*100);
        temp = temp%length;
        result += characters[temp];
        console.log(temp + "," + length);
    }
    passwordDisplay.textContent = result;
}

function setIndicator(color){
    indicator.style.cssText=`box-shadow: 0px 0px 1.5rem ${color}; background: ${color}`;
}
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if( (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    if(passwordDisplay.value.length==0){
        copyMsg.innerText = "Failed";
    }
    else{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }

    // to make copy wala span visible.
    copyMsg.classList.add('active');
    setTimeout(()=>{
        console.log(copyMsg.classList);
        copyMsg.classList.remove('active');
    }, 2000);
}

inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

function checkBoxCnt(){
    let count=0;
    allCheckBox.forEach( (checkBox) => {
        if(checkBox.checked) count++;
    })
    return count;
}

// shuffle array.
function shufflePassword(password){
    // Fisher Yates Method.
    for(let i = password.length - 1 ; i > 0 ; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = password[i];
        password[i] = password[j];
        password[j] = temp;
    }
    let str = "";
    password.forEach( (el) => (str += el));
    return str;
}

function genereatePassword(){
    let checkCount = checkBoxCnt();
    
    // none of the checkedBox is selected.
    if(checkCount==0) return;

    // passwordlength is smaller than checkCount.
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    let password = "";
    console.log(password);
    // Add compulsory elements.
    let array = [];
    if(uppercaseCheck.checked) array.push(generateUpperCase);

    if(lowercaseCheck.checked) array.push(generateLowerCase);
    
    if(numbersCheck.checked) array.push(generateRandomNumber);
    
    if(symbolsCheck.checked) array.push(generateSymbols);

    array.forEach((Element) =>{
        password += Element();
    })

    // remaining addition.
    for(let i=0; i < passwordLength - array.length; i++){
        let idx = getRandomInt(0,array.length);
        password += array[idx]();
    }

    // shuffle password.
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;
    // calculate password strength.
    calcStrength();
}