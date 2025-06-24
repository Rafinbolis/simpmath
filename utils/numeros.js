function gerarNumero(){
    const x = Math.floor(Math.random()*12);

    let y;
    
    do {
        y = Math.floor(Math.random()*12 );
    } while (y>x || y==0);
    
    return{
        num1: x,
        num2: y,  
    };

}

function calcular(){
    return{
        sub: num1 - num2,
        som: num1 + num2,
        multi: num1 * num3,
        divi: num1/ num2,
    }
}


module.exports={
    gerarNumero,
    calcular

}