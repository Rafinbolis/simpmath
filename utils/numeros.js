function gerarNumero(){
    const x = Math.floor(Math.random()*12);

    let y;
    
    do {
        y = Math.floor(Math.random()*12 );
    } while (y>x || y==0);
    const resultado = x-y;
    return{
        num1: x,
        num2: y,
        correto: resultado,
        desenvover: `A forma certa de fazer essa conta é ${x} - ${y}= ${resultado}`
    };

}



module.exports={
    gerarNumero
}