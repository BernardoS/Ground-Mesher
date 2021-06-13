function calculaRHaste(){
    ResistividadeCard.classList.toggle('animar');
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

function abrirMenu(){
    document.getElementById("ResistividadeCard").style.display = "none";
    document.getElementById("unidadeResistenciaHaste").style.display = "none";
    document.getElementById("menuArranjo").style.display = "flex";
}


function processaMenu(){
    const opcao = String(document.getElementById("tiposAterramento").value);
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

        //console.log(rhm);
        //console.log(bhm);
        var resistenciaEquivalenteInv=0;
        for(var x = 0;x<QtdHastes; x++){
            resistenciaEquivalenteInv += 1/ResistenciaComMutua[x]; 
        }
        var resistenciaEquivalente = 1/resistenciaEquivalenteInv;
        exibeResultado(resistenciaEquivalente,RHaste,"configHasteMalha");
        draw(posicaoHaste);
    }
}

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
        //base
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
        console.log(posicaoHaste);
        
        
        const bhm = calculaBhm(ComprimentoHaste,posicaoHaste,QtdHastes);
        const rhm = calculaRhm(ResistividadeSolo,ComprimentoHaste,posicaoHaste,bhm,QtdHastes);
        const ResistenciaComMutua = calculaResistenciaComMutua(rhm,QtdHastes,RHaste);

        console.log(rhm);
        //console.log(bhm);

        
        var resistenciaEquivalenteInv=0;
        for(var x = 0;x<QtdHastes; x++){
            resistenciaEquivalenteInv += 1/ResistenciaComMutua[x]; 
        }
        var resistenciaEquivalente = 1/resistenciaEquivalenteInv;
        exibeResultado(resistenciaEquivalente,RHaste,"configHasteQuadrado");
        draw(posicaoHaste);
    }
}


function processaHasteTriangular(){
    const QtdHastes = Number(document.getElementById("QtdHastesTriangular").value);
    const DistanciaHaste = Number(document.getElementById("DistanciaHasteTriangular").value);

    const ResistividadeSolo = Number(document.getElementById("ResistividadeSolo").value);
    const ComprimentoHaste = Number(document.getElementById("ComprimentoHaste").value);
    const DiametroHaste = Number(document.getElementById("DiametroHaste").value)*0.0254;

    //variáveis calculadas
    const logaritmo = Math.log((4*ComprimentoHaste)/DiametroHaste);
    const RHaste = (ResistividadeSolo/(2*Math.PI*ComprimentoHaste))*logaritmo;

    if (!(QtdHastes%3==0)) {
        alert("Digite uma quantidade de Hastes Múltipla de 3");
    } else {
        var posicaoHaste =[{x:0,y:0}];
        //base
        for(var i = 1; i <= QtdHastes/3 ; i++){
            var x = DistanciaHaste*i;
            var y = 0;
            posicaoHaste.push({x,y});
        }
        //lado 1
        for(var i = 1; i <= QtdHastes/3 ; i++){
            var x = (DistanciaHaste/2)*i;
            var y = (DistanciaHaste*((Math.sqrt(3))/2))*i;
            posicaoHaste.push({x,y});
        }
        //lado 2
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
        //console.log(resistenciaEquivalente);
        exibeResultado(resistenciaEquivalente,RHaste,"configHasteTriangulo");
        draw(posicaoHaste);
    }
}

//Função responsável pelo cálculo das Hastes Circulares
function processaHasteCircular(){
        //variáveis captadas
        const QtdHastes = Number(document.getElementById("QtdHastesCircular").value);
        const RaioCirculo = Number(document.getElementById("RaioCirculo").value);

        const ResistividadeSolo = Number(document.getElementById("ResistividadeSolo").value);
        const ComprimentoHaste = Number(document.getElementById("ComprimentoHaste").value);
        const DiametroHaste = Number(document.getElementById("DiametroHaste").value)*0.0254;
        //variáveis calculadas
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

function exibeResultado(resultado,RHaste,classe){
    document.getElementById(classe).style.display = "none";
    document.getElementById("resultados").style.display = "flex";
    document.getElementById("unidadeResistencia").style.display = "flex";
    document.getElementById("FatorK").innerText = `${String((resultado/RHaste).toFixed(4))}`;
    document.getElementById("ResistenciaEquivalente").innerText =`${String(resultado.toFixed(4))}`;
}
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
    
    

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}



//Função responsável pelo cálculo das Hastes Lineares
function processaHasteLinear(){
    //variáveis captadas
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

    //console.log(bhm);

    var resistenciaEquivalenteInv=0;
    for(var x = 0;x<QtdHastes; x++){
        resistenciaEquivalenteInv += 1/ResistenciaComMutua[x]; 
    }
    var resistenciaEquivalente = 1/resistenciaEquivalenteInv;
    //console.log(resistenciaEquivalente);
    exibeResultado(resistenciaEquivalente,RHaste,"configHasteLinear");
    draw(posicaoHaste);
    }
    
}



function calculaBhm(comprimentoHaste,posicaoHaste,qtdHastes){
    let bhm = criaMatrizZero(qtdHastes,qtdHastes);

    for(var i = 0; i<qtdHastes;i++){
        for(var j = 0; j<qtdHastes;j++){
            
            
            let distancia= distanciaRelativa(posicaoHaste[i],posicaoHaste[j]);
            if((i!=j) && (bhm[i][j]==0)){
                //console.log(`Distancia relativa:[${distancia}]`);
                //console.log(`Comprimento Haste:[${comprimentoHaste}]`);
                bhm[i][j] = Math.sqrt(Math.pow(distancia,2)+Math.pow(comprimentoHaste,2));
                bhm[j][i] = Math.sqrt(Math.pow(distancia,2)+Math.pow(comprimentoHaste,2));
                //console.log(`posicao[${i}][${j}]:${bhm[i][j]}`);
            }
        }
    }
    console.log(bhm);
    return bhm;
}
function distanciaRelativa(pos1,pos2){
    let distancia = Math.sqrt(Math.pow((pos1.x-pos2.x),2) + Math.pow((pos1.y-pos2.y),2));  
    return distancia;
}

function criaMatrizZero(linhas,colunas){
    const matrizZero=[];
    for(var i = 0; i<linhas;i++){
        matrizZero.push(criaVetorzero(colunas));
    } 
    //console.log(matrizZero);
    return matrizZero;
}

function criaVetorzero(colunas){
    const vetorZero = [];
    for(var i = 0; i<colunas;i++){
        vetorZero.push(0);
    }
    //console.log(vetorZero);
    return vetorZero;
}

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
    //console.log(rhm);
    return rhm;
}

function calculaResistenciaComMutua(rhm,qtdHastes,rHaste){
    let resistenciaComMutua = criaVetorzero(qtdHastes);
    //console.log(resistenciaComMutua);
    for(var i = 0; i<qtdHastes;i++){
        resistenciaComMutua[i] += rHaste;
        //console.log(resistenciaComMutua[i]);
        for(var n = 0; n<qtdHastes;n++){
            resistenciaComMutua[i] += rhm[i][n];
        }
    }

    console.log(resistenciaComMutua);
    return resistenciaComMutua;
}

function draw(points) {
    //var points =[{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}];
    //var distanciaMaxima = qtdHastes*distanciaHaste;
    var valorMax = maxValue(points);
    //console.log(valorMax);
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var context = canvas.getContext("2d");
        var radius = 10;
        var larguraPlotagem = canvas.width-60;
        var alturaPlotagem = canvas.height-60;
        var basePoint = 30;
      points.forEach(point => {
        //console.log(point.x);
        //console.log(point.y);
        var coordenadaX = valorMax.x==0?0:(point.x/valorMax.x)*larguraPlotagem;
        var coordenadaY = valorMax.y==0?0:(point.y/valorMax.y)*alturaPlotagem;
        //console.log(coordenadaX);
        //console.log(coordenadaY);
        //ctx.fillStyle = "rgb(82, 141, 241)";
        //ctx.fillRect (0,0,25,25);
    
        context.beginPath();
        context.arc((coordenadaX)+basePoint, (coordenadaY)+basePoint, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'rgb(7, 57, 174)';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = 'rgb(7, 57, 174)';
        context.stroke();
        
      });
      
      //ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
      //ctx.fillRect (30, 30, 55, 50);
    }
}
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
