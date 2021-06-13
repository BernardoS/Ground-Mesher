//função responsável por calcular a resistência individual de uma haste
function calculaRHaste(){
    const ResistividadeSolo = Number(document.getElementById("ResistividadeSolo").value);
    const ComprimentoHaste = Number(document.getElementById("ComprimentoHaste").value);
    const DiametroHaste = Number(document.getElementById("DiametroHaste").value)*0.0254;

    if(!ResistividadeSolo||!ComprimentoHaste||!DiametroHaste){
        alert("Preencha os valores do formulário")
    }else{
        var logaritmo = Math.log((4*ComprimentoHaste)/DiametroHaste);
        var RHaste = (ResistividadeSolo/(2*Math.PI*ComprimentoHaste))*logaritmo;
        document.getElementById("ResistividadeHaste").innerText = String(RHaste.toFixed(4));
        document.getElementById("continuarButton").style.display = "flex";
        document.getElementById("unidadeResistenciaHaste").style.display = "flex";
    }
}
//função responsável por abrir menu
function abrirMenu(){
    document.getElementById("ResistividadeCard").style.display = "none";
    document.getElementById("unidadeResistenciaHaste").style.display = "none";
    document.getElementById("passoUm").classList.toggle("passoSelecionado");
    document.getElementById("passoDois").classList.toggle("passoSelecionado");
    document.getElementById("menuArranjo").style.display = "flex";
}
//função responsável por processar a opção escolhida no menu
function processaMenu(){
    const opcao = String(document.getElementById("tiposAterramento").value);
    document.getElementById("passoDois").classList.toggle("passoSelecionado");
    document.getElementById("passoTres").classList.toggle("passoSelecionado");
    switch (opcao) {
        case 'linear':
            document.getElementById("configHasteLinear").style.display = "flex";
            document.getElementById("menuArranjo").style.display = "none";
            break;
        case 'circular':
            document.getElementById("configHasteCircular").style.display = "flex";
            document.getElementById("menuArranjo").style.display = "none";
            break;
        case 'quadrado':
            document.getElementById("configHasteQuadrado").style.display = "flex";
            document.getElementById("menuArranjo").style.display = "none";
            break;
        case 'malha':
            document.getElementById("configHasteMalha").style.display = "flex";
            document.getElementById("menuArranjo").style.display = "none";
            break;
        case 'triangulo':
            document.getElementById("configHasteTriangulo").style.display = "flex";
            document.getElementById("menuArranjo").style.display = "none";
            break;
        default:
            break;
    }
    
}
//faz o cálculo da resistência equivalente de um arranjo com hastes dispostas em formato de malha(quadrado cheio)
function processaHasteMalha(){
    const QtdHastes = Number(document.getElementById("QtdHastesMalha").value);
    const DistanciaHaste = Number(document.getElementById("DistanciaHasteMalha").value);

    const ResistividadeSolo = Number(document.getElementById("ResistividadeSolo").value);
    const ComprimentoHaste = Number(document.getElementById("ComprimentoHaste").value);
    const DiametroHaste = Number(document.getElementById("DiametroHaste").value)*0.0254;

    const logaritmo = Math.log((4*ComprimentoHaste)/DiametroHaste);
    const RHaste = (ResistividadeSolo/(2*Math.PI*ComprimentoHaste))*logaritmo;
    if(!Number.isInteger(Math.sqrt(QtdHastes))){
        alert("O número informado deve possuir uma raiz quadrada inteira. Ex.: 4,9,16");
    }else if(QtdHastes <= 1){
        alert("Digite um número maior");
    }else{
        var posicaoHaste = [];
        var qtdLinhas = Math.sqrt(QtdHastes);
        var qtdColunas = Math.sqrt(QtdHastes);
        for (let i = 0; i < qtdLinhas; i++) {
            for (let j = 0; j < qtdColunas; j++) {
                console.log(`[${i}] [${j}]`);
                if ((i==0)&&(j==0)) {
                    posicaoHaste = [{x:i,y:j}];
                }else{
                    posicaoHaste.push({x:DistanciaHaste*j,y:DistanciaHaste*i});
                }
            }
        }
        
        const bhm = calculaBhm(ComprimentoHaste,posicaoHaste,QtdHastes);
        const rhm = calculaRhm(ResistividadeSolo,ComprimentoHaste,posicaoHaste,bhm,QtdHastes);
        const ResistenciaComMutua = calculaResistenciaComMutua(rhm,QtdHastes,RHaste);
        var resistenciaEquivalenteInv=0;
        for(var x = 0;x<QtdHastes; x++){
            resistenciaEquivalenteInv += 1/ResistenciaComMutua[x]; 
        }
        var resistenciaEquivalente = 1/resistenciaEquivalenteInv;
        exibeResultado(resistenciaEquivalente,RHaste,"configHasteMalha");
        draw(posicaoHaste);
    }
}
//faz o cálculo da resistência equivalente de um arranjo com hastes dispostas em formato de quadrado
function processaHasteQuadrado(){
    const QtdHastes = Number(document.getElementById("QtdHastesQuadrado").value);
    const DistanciaHaste = Number(document.getElementById("DistanciaHasteQuadrado").value);

    const ResistividadeSolo = Number(document.getElementById("ResistividadeSolo").value);
    const ComprimentoHaste = Number(document.getElementById("ComprimentoHaste").value);
    const DiametroHaste = Number(document.getElementById("DiametroHaste").value)*0.0254;

    const logaritmo = Math.log((4*ComprimentoHaste)/DiametroHaste);
    const RHaste = (ResistividadeSolo/(2*Math.PI*ComprimentoHaste))*logaritmo;
    
    if (!(QtdHastes%4==0)) {
        alert("Digite uma quantidade de Hastes Múltipla de 4");
    }else if(QtdHastes<=1){
        alert("Digite um número maior");
    }else{
        var posicaoHaste = [{x:0,y:0}];
        for(var i =1; i<= QtdHastes/4 ;i++ ){
            var x = DistanciaHaste*i ;
            var y = 0;
            posicaoHaste.push({x,y});
        }
        for(var i =1; i<= QtdHastes/4 ;i++ ){
            var x = 0;
            var y = DistanciaHaste*i;
            posicaoHaste.push({x,y});
        }
        for(var i =1; i< QtdHastes/4 ;i++ ){
                x = DistanciaHaste*(QtdHastes/4);
                y = DistanciaHaste*i;
                posicaoHaste.push({x,y});
        }
        for(var i =1; i<= QtdHastes/4 ;i++ ){
            if(posicaoHaste.length!=QtdHastes){
                var x = DistanciaHaste*i ;
                var y = DistanciaHaste*(QtdHastes/4);
                posicaoHaste.push({x,y});
            }    
        }
        
        const bhm = calculaBhm(ComprimentoHaste,posicaoHaste,QtdHastes);
        const rhm = calculaRhm(ResistividadeSolo,ComprimentoHaste,posicaoHaste,bhm,QtdHastes);
        const ResistenciaComMutua = calculaResistenciaComMutua(rhm,QtdHastes,RHaste);
        
        var resistenciaEquivalenteInv=0;
        for(var x = 0;x<QtdHastes; x++){
            resistenciaEquivalenteInv += 1/ResistenciaComMutua[x]; 
        }
        var resistenciaEquivalente = 1/resistenciaEquivalenteInv;
        exibeResultado(resistenciaEquivalente,RHaste,"configHasteQuadrado");
        draw(posicaoHaste);
    }
}
//faz o cálculo da resistência equivalente de um arranjo com hastes dispostas em formato de triangulo
function processaHasteTriangular(){
    const QtdHastes = Number(document.getElementById("QtdHastesTriangular").value);
    const DistanciaHaste = Number(document.getElementById("DistanciaHasteTriangular").value);

    const ResistividadeSolo = Number(document.getElementById("ResistividadeSolo").value);
    const ComprimentoHaste = Number(document.getElementById("ComprimentoHaste").value);
    const DiametroHaste = Number(document.getElementById("DiametroHaste").value)*0.0254;

    const logaritmo = Math.log((4*ComprimentoHaste)/DiametroHaste);
    const RHaste = (ResistividadeSolo/(2*Math.PI*ComprimentoHaste))*logaritmo;

    if (!(QtdHastes%3==0)) {
        alert("Digite uma quantidade de Hastes Múltipla de 3");
    } else {
        var posicaoHaste =[{x:0,y:0}];
        for(var i = 1; i <= QtdHastes/3 ; i++){
            var x = DistanciaHaste*i;
            var y = 0;
            posicaoHaste.push({x,y});
        }
        for(var i = 1; i <= QtdHastes/3 ; i++){
            var x = (DistanciaHaste/2)*i;
            var y = (DistanciaHaste*((Math.sqrt(3))/2))*i;
            posicaoHaste.push({x,y});
        }
        for(var i = 1; i < QtdHastes/3 ; i++){
            var pontoBase = (QtdHastes/3)*DistanciaHaste;
            var x = pontoBase - (DistanciaHaste/2)*i;
            var y = (DistanciaHaste*((Math.sqrt(3))/2))*i;
            posicaoHaste.push({x,y});
        }

        const bhm = calculaBhm(ComprimentoHaste,posicaoHaste,QtdHastes);
        const rhm = calculaRhm(ResistividadeSolo,ComprimentoHaste,posicaoHaste,bhm,QtdHastes);
        const ResistenciaComMutua = calculaResistenciaComMutua(rhm,QtdHastes,RHaste);

        var resistenciaEquivalenteInv=0;
        for(var x = 0;x<QtdHastes; x++){
            resistenciaEquivalenteInv += 1/ResistenciaComMutua[x]; 
        }
        var resistenciaEquivalente = 1/resistenciaEquivalenteInv;
        exibeResultado(resistenciaEquivalente,RHaste,"configHasteTriangulo");
        draw(posicaoHaste);
    }
}
//faz o cálculo da resistência equivalente de um arranjo com hastes dispostas circularmente
function processaHasteCircular(){
        const QtdHastes = Number(document.getElementById("QtdHastesCircular").value);
        const RaioCirculo = Number(document.getElementById("RaioCirculo").value);

        const ResistividadeSolo = Number(document.getElementById("ResistividadeSolo").value);
        const ComprimentoHaste = Number(document.getElementById("ComprimentoHaste").value);
        const DiametroHaste = Number(document.getElementById("DiametroHaste").value)*0.0254;

        const logaritmo = Math.log((4*ComprimentoHaste)/DiametroHaste);
        const RHaste = (ResistividadeSolo/(2*Math.PI*ComprimentoHaste))*logaritmo;
        
        const baseAngle = (Math.PI*(360/QtdHastes))/180;

        var posicaoHaste = [];
        for (let i = 0; i < QtdHastes; i++) {
            posicaoHaste.push({x:(Math.cos(baseAngle*i)+1).toFixed(3),y:(Math.sin(baseAngle*i)+1).toFixed(3)});   
        }
        console.log(posicaoHaste);

        if(QtdHastes<=1){
            alert("Digite um número maior");
        }else{
            const k = ((QtdHastes/2) - 1);
            const rB = ComprimentoHaste/(Math.log((4*ComprimentoHaste)/(DiametroHaste))-1);
            const B = (rB/RaioCirculo).toFixed(2);
            console.log(B);
                let somatorio = 0;
                for (var n = 1;n < k; n++){
                    somatorio += (1/Math.sin((n*Math.PI)/QtdHastes));
                }
            let ReqCirculo = ((RHaste/QtdHastes)*(1+(B/2)+(B*somatorio)));
            
            exibeResultado(ReqCirculo,RHaste,"configHasteCircular");
        }
        draw(posicaoHaste);
}
//Exibe o resutlado dos cálculos
function exibeResultado(resultado,RHaste,classe){
    document.getElementById("passoTres").classList.toggle("passoSelecionado");
    document.getElementById("passoQuatro").classList.toggle("passoSelecionado");
    document.getElementById(classe).style.display = "none";
    document.getElementById("resultados").style.display = "flex";
    document.getElementById("unidadeResistencia").style.display = "flex";
    document.getElementById("FatorK").innerText = `${String((resultado/RHaste).toFixed(4))}`;
    document.getElementById("ResistenciaEquivalente").innerText =`${String(resultado.toFixed(4))}`;
}
//Volta a página inicial do programa
function voltarAoInicio(){
    document.getElementById("ResistividadeCard").style.display = "flex";
    document.getElementById("resultados").style.display = "none";
    document.getElementById("menuArranjo").style.display = "none";
    document.getElementById("configHasteCircular").style.display = "none";
    document.getElementById("configHasteLinear").style.display = "none";
    document.getElementById("configHasteQuadrado").style.display = "none";
    document.getElementById("configHasteMalha").style.display = "none";
    document.getElementById("configHasteTriangulo").style.display = "none";
    document.getElementById("ResistividadeSolo").value = null;
    document.getElementById("ComprimentoHaste").value = null;
    document.getElementById("DiametroHaste").value = null;
    document.getElementById("QtdHastesCircular").value = null;
    document.getElementById("QtdHastesLinear").value =  null;
    document.getElementById("QtdHastesMalha").value = null;
    document.getElementById("QtdHastesTriangular").value = null;
    document.getElementById("QtdHastesQuadrado").value = null;
    document.getElementById("DistanciaHasteTriangular").value = null;
    document.getElementById("DistanciaHasteLinear").value = null;
    document.getElementById("DistanciaHasteQuadrado").value = null;
    document.getElementById("RaioCirculo").value = null;
    document.getElementById("QtdHastesMalha").value = null;
    document.getElementById("ResistividadeHaste").innerText = "...";
    document.getElementById("passoQuatro").classList.remove("passoSelecionado");
    document.getElementById("passoUm").classList.add("passoSelecionado");
    
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}
//faz o cálculo da resistência equivalente de um arranjo com hastes dispostas linearmente
function processaHasteLinear(){

    const QtdHastes = Number(document.getElementById("QtdHastesLinear").value);
    const DistanciaHaste = Number(document.getElementById("DistanciaHasteLinear").value);

    const ResistividadeSolo = Number(document.getElementById("ResistividadeSolo").value);
    const ComprimentoHaste = Number(document.getElementById("ComprimentoHaste").value);
    const DiametroHaste = Number(document.getElementById("DiametroHaste").value)*0.0254;

    const logaritmo = Math.log((4*ComprimentoHaste)/DiametroHaste);
    const RHaste = (ResistividadeSolo/(2*Math.PI*ComprimentoHaste))*logaritmo;

    if(QtdHastes<=1){
        alert("Digite um número maior");
    }else{
        var posicaoHaste = [];
    for(var i = 0 ; i < QtdHastes ; i++){
        posicaoHaste.push({
            x:DistanciaHaste*i,
            y:0,
        })
    }

    const bhm = calculaBhm(ComprimentoHaste,posicaoHaste,QtdHastes);
    const rhm = calculaRhm(ResistividadeSolo,ComprimentoHaste,posicaoHaste,bhm,QtdHastes);
    const ResistenciaComMutua = calculaResistenciaComMutua(rhm,QtdHastes,RHaste);

    var resistenciaEquivalenteInv=0;
    for(var x = 0;x<QtdHastes; x++){
        resistenciaEquivalenteInv += 1/ResistenciaComMutua[x]; 
    }
    var resistenciaEquivalente = 1/resistenciaEquivalenteInv;
    exibeResultado(resistenciaEquivalente,RHaste,"configHasteLinear");
    draw(posicaoHaste);
    }
    
}
//calcula BHM
function calculaBhm(comprimentoHaste,posicaoHaste,qtdHastes){
    let bhm = criaMatrizZero(qtdHastes,qtdHastes);

    for(var i = 0; i<qtdHastes;i++){
        for(var j = 0; j<qtdHastes;j++){
            let distancia= distanciaRelativa(posicaoHaste[i],posicaoHaste[j]);
            if((i!=j) && (bhm[i][j]==0)){
                bhm[i][j] = Math.sqrt(Math.pow(distancia,2)+Math.pow(comprimentoHaste,2));
                bhm[j][i] = Math.sqrt(Math.pow(distancia,2)+Math.pow(comprimentoHaste,2));
            }
        }
    }
    return bhm;
}
//calcular a distância entre 2 pontos no plano x y
function distanciaRelativa(pos1,pos2){
    let distancia = Math.sqrt(Math.pow((pos1.x-pos2.x),2) + Math.pow((pos1.y-pos2.y),2));  
    return distancia;
}
//cria uma matriz preenchida por zeros
function criaMatrizZero(linhas,colunas){
    const matrizZero=[];
    for(var i = 0; i<linhas;i++){
        matrizZero.push(criaVetorzero(colunas));
    } 
    return matrizZero;
}
//cria um vetor preenchido por zeros
function criaVetorzero(colunas){
    const vetorZero = [];
    for(var i = 0; i<colunas;i++){
        vetorZero.push(0);
    }
    return vetorZero;
}
//calcular RHM
function calculaRhm(resistividadeSolo,comprimentoHaste,posicaoHaste,bhm,qtdHastes){
    let rhm = criaMatrizZero(qtdHastes,qtdHastes);
    for(var i = 0; i<qtdHastes;i++){
        for(var j = 0; j<qtdHastes;j++){
            let distancia = distanciaRelativa(posicaoHaste[i],posicaoHaste[j]);

            let primeiroFator = resistividadeSolo/(4*Math.PI*comprimentoHaste);
            let logaritmo = (Math.pow((bhm[i][j]+comprimentoHaste),2) - Math.pow(distancia,2))/(Math.pow(distancia,2)-Math.pow((bhm[i][j]-comprimentoHaste),2));
            let segundoFator = Math.log(logaritmo);
            if((i!=j) && (rhm[i][j]==0)){
                rhm[i][j] = primeiroFator*segundoFator; 
            }
        }
    }

    return rhm;
}
//calcula a resistência com a influência mutuas
function calculaResistenciaComMutua(rhm,qtdHastes,rHaste){
    let resistenciaComMutua = criaVetorzero(qtdHastes);

    for(var i = 0; i<qtdHastes;i++){
        resistenciaComMutua[i] += rHaste;

        for(var n = 0; n<qtdHastes;n++){
            resistenciaComMutua[i] += rhm[i][n];
        }
    }

    console.log(resistenciaComMutua);
    return resistenciaComMutua;
}
//desenha as posições das hastes
function draw(points) {

    var valorMax = maxValue(points);

    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var context = canvas.getContext("2d");
        var radius = 10;
        var larguraPlotagem = canvas.width-60;
        var alturaPlotagem = canvas.height-60;
        var basePoint = 30;
      points.forEach(point => {

        var coordenadaX = valorMax.x==0?0:(point.x/valorMax.x)*larguraPlotagem;
        var coordenadaY = valorMax.y==0?0:(point.y/valorMax.y)*alturaPlotagem;

    
        context.beginPath();
        context.arc((coordenadaX)+basePoint, (coordenadaY)+basePoint, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'rgb(7, 57, 174)';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = 'rgb(7, 57, 174)';
        context.stroke();
        
      });
      
    }
}
//retorna o valor máximo dentro da matriz de posicoes
function maxValue(matrizPosicao){
    var valorMaxX = 0;
    var valorMaxY = 0; 
    matrizPosicao.forEach(posicao => {
        if(posicao.x>valorMaxX){
            valorMaxX=posicao.x;
        }
        if(posicao.y>valorMaxY){
            valorMaxY=posicao.y;
        }
    });
    return {x:valorMaxX,y:valorMaxY};
}