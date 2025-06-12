function gerarBombom(){
    const x = Math.floor(Math.random()*12);

    let y;
    
    do {
        y = Math.floor(Math.random()*12 );
    } while (y>x);
    const resultado = x-y;
    return{
        numero1: x,
        numero2: y,
        correto: resultado,
        desenvover: `A forma certa de fazer essa conta é ${x} - ${y}= ${resultado}`
    };

}

function verificarBombom(){
    const resultado = numero1-numero2;
    
}

module.exports={
    gerarBombom
}