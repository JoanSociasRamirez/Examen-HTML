function temps(minutos, segundos) {
    this.minutos = minutos;
    this.segundos = segundos;
}

temps.prototype.tratar = function () {
    if (this.getSegundos() > 0) {
        this.disminuirSegundos();
    }

    if ((this.getSegundos() == 0) && (this.getMinutos() == 0)) {
        return false;
    }

    if ((this.getSegundos() == 0)) {
        this.disminuirMinutos();
        this.setSegundos(59);
    }


    return true;
};

temps.prototype.getMinutos = function () {
    return this.minutos;
};

temps.prototype.setMinutos = function (minutos) {
    this.minutos = minutos;
};
temps.prototype.disminuirMinutos = function () {
    this.minutos--;
};
temps.prototype.getSegundos = function () {
    return this.segundos;
};

temps.prototype.setSegundos = function (segundos) {
    this.segundos = segundos;
};
temps.prototype.disminuirSegundos = function () {
    this.segundos--;
};



