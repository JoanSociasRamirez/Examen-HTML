//cnt
var RADIO = "radio";
var CHECKBOX = "checkbox";
var DATALIST = "datalist";
var SELECT = "select";
var TEXT = "text";

//var
var http = null;
var xmlDOC = null;
var form = null;
var nPreguntas = 0;
var raton = 0;
var notaF = 0;

//window.onload Temps
window.onload = function () {
    var t;
    var temp = new temps(180, 0);
    total = setInterval(function () {
        t = temp.tratar();
        var mm = temp.getMinutos();
        if (mm < 10) {
            mm = "0" + mm;
        }
        var ss = temp.getSegundos();
        if (ss < 10) {
            ss = "0" + ss;
        }

        document.getElementById("tempM").innerHTML = mm;
        document.getElementById("tempS").innerHTML = ss;
        if (t === false) {
            corregir();
        }
    }, 10);

    leerXml();


    document.getElementById("corregir").onclick = function () {
        corregir();
    };

};

function leerXml() {
    http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            xmlDOC = this.responseXML;
            cargarDatos();
        }
    };
    http.open("GET", "xml/preguntas.xml", true);
    http.send();
}

//formulario
function cargarDatos() {
    addForm();
    nPreguntas = xmlDOC.getElementsByTagName("question").length;
    for (var i = 0; i < nPreguntas; i++) {
        tratarQuestion(i);
    }
    initialize();
}

//hace un div y mete el formulario
function addForm() {
    var div_a = document.getElementById("a");
    form = document.createElement("form");
    div_a.appendChild(form);
    form.id = "exam";
}

//por cada pregunta "question" hace un title
function tratarQuestion(i) {
    var newDiv = addDiv(i);
    addTitle(newDiv, i);
    evaluateType(newDiv, i);
}

//div que contiene las preguntas "qiest"
function addDiv(i) {
    var newDiv = document.createElement("div");
    form.appendChild(newDiv);
    newDiv.id = "div" + i;
    return newDiv;
}

//añade 'title' a las preguntaas "question"
function addTitle(div, i) {
    var p = document.createElement("p");
    div.appendChild(p);
    document.getElementsByTagName("p")[i].innerHTML = xmlDOC.getElementsByTagName("title")[i].innerHTML;
}

//segun el elemento añade el type
function evaluateType(div, i) {
    var type = xmlDOC.getElementsByTagName("type")[i].innerHTML;
    switch (type) {
        case CHECKBOX:
            typeCheckbox(div, i);
            break;
        case DATALIST:
            typeDatalist(div, i);
            break;
        case RADIO:
            typeRadio(div, i);
            break;
        case SELECT:
            typeSelect(div, i);
            break;
        case TEXT:
            typeText(div, i);
            break;
    }
}

//cb
function typeCheckbox(div, i) {
    var nroAux = xmlDOC.getElementsByTagName("question")[i].getElementsByTagName("option").length;
    var label = document.createElement("label");
    div.appendChild(label);
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));
    var divAux = addDivAux(div);
    for (var j = 0; j < nroAux; j++) {
        addCheckbox(divAux, i, j);
    }
}


//añade cb
function addCheckbox(div, i, j) {
    var input = document.createElement("input");
    input.type = "checkbox";
    input.name = "checkbox-" + i;
    input.id = "checkbox_" + i + "_" + j;
    input.className = "check";
    var label = document.createElement("label");
    label.innerHTML = xmlDOC.getElementsByTagName("question")[i].getElementsByTagName("option")[j].innerHTML;
    label.setAttribute("for", "checkbox_" + i + "_" + j);
    label.className = "validate";
    div.appendChild(input);
    div.appendChild(label);
    div.appendChild(document.createElement("br"));
}

//valirdar cB
function validateCheckbox(div, i) {
    var id = document.getElementById("div" + i);
    var q = document.createElement("h2");
    var aux = false;
    var aux2 = false;
    var subnota = 0;
    q.innerHTML = "P." + (i + 1);
    div.appendChild(q);
    //
    var checkbox = id.getElementsByTagName("input");
    var label = id.getElementsByTagName("label");
    var answer = xmlDOC.getElementsByTagName("question")[i].getElementsByTagName("answer");
    //
    for (var j = 0; j < checkbox.length; j++) {
        if (checkbox[j].checked) {
            aux2 = true;
            var p = document.createElement("p");
            p.innerHTML = label[j + 1].innerHTML;
            p.style = "color: red";
            div.appendChild(p);
            aux = false;
            for (var k = 0; k < answer.length; k++) {
                if (answer[k].innerHTML == p.innerHTML) {
                    aux = true;
                    subnota++;
                    p.style = "color: green";
                }
            }
            if (!aux) {
                subnota--;
            }
        }
    }
    if (!aux2) {
        var sinCumpl = document.createElement("p");
        sinCumpl.innerHTML = "Pregunta sin contestar";
        sinCumpl.style = "color: red";
        div.appendChild(sinCumpl);
    }
    var comentario = document.createElement("p");
    if (subnota <= 0) {
        comentario.innerHTML = "0 puntos";
    } else {
        comentario.innerHTML = "+ " + subnota / answer.length + " puntos";
        notaF += subnota / answer.length;
    }
    div.appendChild(comentario);
}

//dL
function typeDatalist(div, i) {
    var nroAux = xmlDOC.getElementsByTagName("question")[i].getElementsByTagName("option").length;
    var label = document.createElement("label");
    div.appendChild(label);
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));
    var inputDatalist = addDatalistInput(div, i);
    for (var j = 0; j < nroAux; j++) {
        addDatalist(inputDatalist, i, j);
    }
}

//input dL
function addDatalistInput(div, i) {
    var input = document.createElement("input");
    input.setAttribute("list", "datalist-" + i);
    input.className = "datalist";
    div.appendChild(input);
    var inputDatalist = document.createElement("datalist");
    inputDatalist.id = "datalist-" + i;
    div.appendChild(inputDatalist);
    return inputDatalist;
}

//opcion dL
function addDatalist(inputDatalist, i, j) {
    var aux = document.createElement("option");
    aux.value = xmlDOC.getElementsByTagName("question")[i].getElementsByTagName("option")[j].innerHTML;
    aux.className = "datalist-option";
    inputDatalist.appendChild(aux);
}
//validar dL
function validateDatalist(div, i) {
    var id = document.getElementById("div" + i);
    var q = document.createElement("h2");
    q.innerHTML = "P." + (i + 1);
    div.appendChild(q);
    var aux = id.getElementsByTagName("input")[0];
    var answer = xmlDOC.getElementsByTagName("question")[i].getElementsByTagName("answer")[0];
    var p = document.createElement("p");
    p.innerHTML = aux.value;
    div.appendChild(p);
    //
    if (aux.value == "") {
        var sinCumpl = document.createElement("p");
        sinCumpl.innerHTML = "Pregunta sin contestar";
        sinCumpl.style = "color: red";
        div.appendChild(sinCumpl);
    }
    //
    var comentario = document.createElement("p");
    if (aux.value == answer.innerHTML) {
        p.style = "color: green";
        comentario.innerHTML = "+ 1 puntos";
        notaF++;
    } else {
        p.style = "color: red";
        comentario.innerHTML = "0 puntos";
    }
    div.appendChild(comentario);
}

//radio
function typeRadio(div, i) {
    var nroAux = xmlDOC.getElementsByTagName("question")[i].getElementsByTagName("option").length;
    var label = document.createElement("label");
    div.appendChild(label);
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));
    var divAux = addDivAux(div);
    for (var j = 0; j < nroAux; j++) {
        addRadio(divAux, i, j);
    }
}


function addRadio(div, i, j) {
    var input = document.createElement("input");
    input.type = "radio";
    input.name = "radio-" + i;
    input.id = "radio-" + i + "-" + j;
    input.className = "radio";
    var label = document.createElement("label");
    label.innerHTML = xmlDOC.getElementsByTagName("question")[i].getElementsByTagName("option")[j].innerHTML;
    label.setAttribute("for", "radio-" + i + "-" + j);
    label.className = "validate";
    div.appendChild(input);
    div.appendChild(label);
    div.appendChild(document.createElement("br"));
}
//validar radio
function validateRadio(div, i) {
    var id = document.getElementById("div" + i);
    var q = document.createElement("h2");
    q.innerHTML = "P." + (i + 1);
    div.appendChild(q);
    var aux = false;
    var select = id.getElementsByTagName("input");
    var label = id.getElementsByTagName("label");
    var answer = xmlDOC.getElementsByTagName("question")[i].getElementsByTagName("answer");
    var comentario = document.createElement("p");
    for (var j = 0; j < select.length; j++) {
        if (select[j].checked) {
            aux = true;
            var p = document.createElement("p");
            p.innerHTML = label[j + 1].innerHTML;
            if (p.innerHTML == answer[0].innerHTML) {
                p.style = "color: green";
                comentario.innerHTML = "+ 1 puntos";
                notaF++;
            } else {
                p.style = "color: red";
                comentario.innerHTML = "0 puntos";
            }
            div.appendChild(p);
        }
    }
    if (!aux) {
        var sinCumpl = document.createElement("p");
        sinCumpl.innerHTML = "Pregunta sin contestar";
        sinCumpl.style = "color: red";
        div.appendChild(sinCumpl);
        comentario.innerHTML = "0 puntos";
    }
    div.appendChild(comentario);
}
//validar select
function validateSelect(div, i) {
    var id = document.getElementById("div" + i);
    var q = document.createElement("h2");
    q.innerHTML = "P." + (i + 1);
    div.appendChild(q);
    var aux = id.getElementsByTagName("select")[0];
    var answer = xmlDOC.getElementsByTagName("question")[i].getElementsByTagName("answer")[0];
    var p = document.createElement("p");
    var comentario = document.createElement("p");
    if (aux.value == -1) {
        var p = document.createElement("p");
        p.innerHTML = "Pregunta sin contestar";
        p.style = "color: red";
        comentario.innerHTML = "0 puntos";

    } else {
        p.innerHTML = aux.value;
    }
    div.appendChild(p);
    if (aux.value == answer.innerHTML) {
        p.style = "color: green";
        comentario.innerHTML = "+ 1 puntos";
        notaF++;
    } else {
        p.style = "color: red";
        comentario.innerHTML = "0 puntos";
    }


    div.appendChild(comentario);
}
//select
function typeSelect(div, i) {
    var nroAux = xmlDOC.getElementsByTagName("question")[i].getElementsByTagName("option").length;
    var label = document.createElement("label");
    div.appendChild(label);
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));
    var inputSelect = addSelectInput(div, i);
    for (var j = 0; j < nroAux; j++) {
        addSelect(inputSelect, i, j);
    }
}

function addSelectInput(div, i) {
    var inputSelect = document.createElement("select");
    inputSelect.id = "select-" + i;
    inputSelect.className = "select";
    div.appendChild(inputSelect);
    var defaultOption = document.createElement("option");
    defaultOption.value = "-1";
    defaultOption.className = "select-option";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    inputSelect.appendChild(defaultOption);
    return inputSelect;
}

function addSelect(inputSelect, i, j) {
    var input = document.createElement("option");
    input.value = xmlDOC.getElementsByTagName("question")[i].getElementsByTagName("option")[j].innerHTML;
    input.innerHTML = xmlDOC.getElementsByTagName("question")[i].getElementsByTagName("option")[j].innerHTML;
    input.className = "select-option";
    inputSelect.appendChild(input);
}

//text
function typeText(div, i) {
    var label = document.createElement("label");
    div.appendChild(label);
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));
    var typeText = document.createElement("input");
    typeText.type = "text";
    typeText.className = "input-text";
    div.appendChild(typeText);
}
//validar text
function validateText(div, i) {
    var id = document.getElementById("div" + i);
    var q = document.createElement("h2");
    q.innerHTML = "P." + (i + 1);
    div.appendChild(q);
    var answer = xmlDOC.getElementsByTagName("question")[i].getElementsByTagName("answer");
    var aux = id.getElementsByTagName("input");
    var p = document.createElement("p");
    var comentario = document.createElement("p");
    if (aux[0].value == "") {
        p.innerHTML = "Pregunta sin contestar";
        p.style = "color:red";
        comentario.innerHTML = "0 puntos";
    } else {
        p.innerHTML = aux[0].value;
    }
    if (aux[0].value.toLowerCase() == answer[0].innerHTML.toLowerCase()) {
        p.style = "color:green";
        comentario.innerHTML = "+ 1 puntos";
        notaF++;
    } else {
        p.style = "color:red";
        comentario.innerHTML = "0 puntos";
    }
    div.appendChild(p);
    div.appendChild(comentario);
}


//inicia n Pregunta del formulario
function initialize() {
    document.getElementById("nroQ").innerHTML = raton + 1;
    document.getElementById("div" + raton).style = "display: block;";
}

//corregir
function corregir() {
    clearInterval(total);
    var div = document.getElementById("c");
    div.style = "display:block";
    document.getElementById("corregir").style = "display: none";
    document.getElementById("a").style = "display: none";
    //
    for (var i = 0; i < nPreguntas; i++) {
        var auxType = xmlDOC.getElementsByTagName("question")[i].getElementsByTagName("type")[0].innerHTML;
        switch (auxType) {
            case CHECKBOX:
                validateCheckbox(div, i);
                break;
            case DATALIST:
                validateDatalist(div, i);
                break;
            case RADIO:
                validateRadio(div, i);
                break;
            case SELECT:
                validateSelect(div, i);
                break;
            case TEXT:
                validateText(div, i);
                break;
        }
    }
    //
    div.appendChild(document.createElement("br"));

    if (notaF < 0) {
        notaF = 0;
    }
    var h1 = document.createElement("h1");
    h1.innerHTML = "Nota final: " + notaF;
    div.appendChild(h1);
    var volver = document.createElement("a");
    volver.href = "index.html";
    div.appendChild(volver);
    var b = document.createElement("b");
    b.innerHTML = "Volver";
    volver.appendChild(b);
}

function addDivAux(div) {
    var divAux = document.createElement("div");
    divAux.style = "text-align: left;";
    div.appendChild(divAux);
    return divAux;
}