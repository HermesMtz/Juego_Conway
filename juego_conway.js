var canvas;
var engine;
var fps = 30;

var canvasX = 500; //pixels ancho
var canvasY = 500; //pixels alto
var tileX, tileY;

//Variables relacionadas con el tablero de juego
var tablero;
var filas = 100; //100
var columnas = 100; //100

var blanco = "#FFFFFF";
var negro = "#000000";

function creaArray2D(f, c) {
  var obj = new Array(f);
  for (y = 0; y < f; y++) {
    obj[y] = new Array(c);
  }

  return obj;
}

//OBJETO AGENTE O TURMITA
var Agente = function (x, y, estado) {
  this.x = x;
  this.y = y;
  this.estado = estado; //vivo = 1, muerto = 0
  this.estadoProx = this.estado; //estado que tendrá en el siguiente ciclo

  this.vecinos = []; //guardamos el listado de sus vecinos

  //Método que añade los vecinos del objeto actual
  this.addVecinos = function () {
    var xVecino;
    var yVecino;

    for (i = -1; i <= 1; i++) {
      for (j = -1; j <= 1; j++) {
        xVecino = (this.x + j + columnas) % columnas;
        yVecino = (this.y + i + filas) % filas;

        //descartamos el agente actual (yo no puedo ser mi propio vecino)
        if (i != 0 || j != 0) {
          this.vecinos.push(tablero[yVecino][xVecino]);
        }
      }
    }
  };

  this.dibuja = function () {
    var color;

    if (this.estado == 1) {
      color = blanco;
    } else {
      color = negro;
    }

    // Convertimos coordenadas a WebGL
    var glX = this.x * tileX;
    var glY = this.y * tileY;

    // Dibujamos el cuadrado correspondiente
    scene.beginDrawing();
    var quad = BABYLON.Mesh.CreateQuad("quad", tileX, tileY, scene);
    quad.position.x = glX;
    quad.position.y = 0;
    quad.position.z = glY;
    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseColor = new BABYLON.Color3(color);
    quad.material = mat;
    scene.endDrawing();
  };

  //leyes de Conway
  this.nuevoCiclo = function () {
    var suma = 0;

    //calculamos la cantidad de vecinos vivos
    for (i = 0; i < this.vecinos.length; i++) {
      suma += this.vecinos[i].estado;
    }

    //CONWAY

    //Valor por defecto lo dejamos igual
    this.estadoProx = this.estado;

    //MUERTE: tiene menos de 2 o más de 3
    if (suma < 2 || suma > 3) {
      this.estadoProx = 0;
    }

    //VIDA/REPRODUCCIÓN: tiene exactamente 3 vecinos
    if (suma == 3) {
      this.estadoProx = 1;
    }
  };

  this.mutacion = function () {
    this.estado;
  };
};
