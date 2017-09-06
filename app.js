var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var util = require('util');
var expressValidator = require('express-validator');
var fs = require('fs');
var cursos = require('./modules/managCursos');
var bootstrap = require('bootstrap-styl');
    //stylus    = require('stylus');

/*function compile(str) {
    return stylus(str)
        .use(bootstrap());
}*/
var app = express();


//MIDDLEWARES

//favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(expressValidator());
/*app.use(stylus.middleware({
    src: path.join(__dirname, 'public')
    , compile: compile
}));*/



app.post("/cursos",function (request,response) {

    //comprobaciones
    request.checkBody("NombreCurso", "El curso necesita un nombre").notEmpty();
    request.checkBody("Descripcion", "El curso necesita una descripcion").notEmpty();
    request.checkBody("Localidad", "La localidad no puede ser nula").notEmpty();
    request.checkBody("Direccion", "La direccion no puede ser nula").notEmpty();
    request.checkBody("NumPlazas", "El numero de plazas no puede ser nulo").notEmpty();
    request.checkBody("FechaInicio", "Es necesaria una fecha de inicio").notEmpty();
    request.checkBody("FechaFin", "Es necesaria una fecha de fin").notEmpty();

    request.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            response.status(400).send(('There have been validation errors: ' + util.inspect(result.array())));
            return;
        }

        cursos.addCurso(request.body,function (err,idCURSO) {
            if(err){
              console.log(err);
              response.status(400);
            }
              else{
              console.log("Se a añadido el curso numero: "+ idCURSO);
              response.status(200);
           }
       });
    });
    response.end();
});
//Carga pagina inicio
app.get("/",function(req,res){
    fs.readFile('./views/index.html', function (err, html)
    {
        if (err) {
            throw err;
        }
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();
    });
});
app.put("/cursos/:indice",function (request,response) {

    var indice = Number(request.params.indice);

    //comprobaciones

    request.checkBody("NombreCurso", "El curso necesita un nombre").notEmpty();
    request.checkBody("Descripcion", "El curso necesita una descripcion").notEmpty();
    request.checkBody("Localidad", "La localidad no puede ser nula").notEmpty();
    request.checkBody("Direccion", "La direccion no puede ser nula").notEmpty();
    request.checkBody("NumPlazas", "El numero de plazas no puede ser nulo").notEmpty();
    request.checkBody("FechaInicio", "Es necesaria una fecha de inicio").notEmpty();
    request.checkBody("FechaFin", "Es necesaria una fecha de fin").notEmpty();

    request.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            response.status(400).send(('There have been validation errors: ' + util.inspect(result.array())));
            return;
        }
        var data = request.body;
        data.indice = indice;
        cursos.editCurso(data,function (err,idCURSO) {
        if(err){
          console.log(err);
          response.status(400);
        }
          else{
          console.log("Se a editado el curso numero: "+ idCURSO);
          response.status(200);
       }
       });
    });
    response.end();
});
app.delete("/cursos/:indice",function (request,response) {

    var indice = Number(request.params.indice);
    cursos.deleteCurso(indice,function (err,idCURSO) {
        if(err){
          console.log(err);
          response.status(400);
        }
          else{
          console.log("Se a eliminado el curso numero: "+ idCURSO);
          response.status(200);
       }
    });
    response.end();
});
app.get("/cursos/:indice",function (request,response) {

    var indice = Number(request.params.indice);
    cursos.getCurso(indice,function (err,result) {
        if(err){
          console.log(err);
          response.status(400);
        }
        else{
          response.status(200);
          response.json(result);
       }
    });
});
app.get("/cursos",function (request,response) {

    var values = {
        name : request.query.name,
        nMax :  request.query.nMax,
        pos : request.query.pos
    };
    cursos.findCurso(values,function (err,result) {
        if(err){
          console.log(err);
          response.status(400);
        }
         else{
          response.status(200);
          response.json(result);
       }
       });

});

app.get("/cursosAll",function (request,response) {

    var values = {
        name : request.query.name
    };
    cursos.findAllCursos(values,function (err,result) {
        if(err){
            console.log(err);
            response.status(400);
        }
        else{
            response.status(200);
            response.json(result);
        }
    });

});


module.exports = app;
