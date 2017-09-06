"use strict";

var config = require('../config');
var mysql = require('mysql');



module.exports = {
  insertCurso: insertCurso,
  editCurso: editCurso,
  deleteCurso: deleteCurso,
  getCurso: getCurso,
  findCurso:findCurso,
  findAllCursos:findAllCursos,
  getHours:getHours
};

//crear pool de conexiones

var pool = mysql.createPool({ host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName
});

//Insercion de un curso

function insertCurso(values,callback) {
    pool.getConnection(function (err, conexion) {
        if (err) return;
        var sql = "INSERT INTO CURSOS(NombreCurso,Descripcion,Localidad,Direccion,NumPlazas,FechaInicio,FechaFin) VALUES (?,?,?,?,?,?,?)";
        var inValues = [values.NombreCurso, values.Descripcion, values.Localidad, values.Direccion, values.NumPlazas, values.FechaInicio, values.FechaFin];
        conexion.query(sql,inValues,function (err, result) {
            if(err){
               callback(err,null);
            }
            else{
                values.Horarios.forEach(function(horario){
                    sql = "INSERT INTO HORARIOS(idCURSO,Dia,HoraInicio,HoraFin) VALUES (?,?,?,?)";
                    inValues = [result.insertId,horario.Dia,horario.HoraInicio,horario.HoraFin];
                    conexion.query(sql,inValues,function(err){

                        if(err){
                            conexion.rollback(function () {
                                throw err;
                            });
                            callback(err,null);
                        }
                    });
                });
            }
            callback(null,result.insertId);
        });
        conexion.release();
    });

}
function editCurso(values,callback) {
    pool.getConnection(function (err, conexion) {
        if (err) return;
        var sql = "UPDATE CURSOS SET NombreCurso = ? ,Descripcion = ? ,Localidad = ?, " +
            "Direccion = ? ,NumPlazas = ? ,FechaInicio = ? ,FechaFin = ? WHERE idCURSO = (?)";
        var inValues = [values.NombreCurso, values.Descripcion, values.Localidad, values.Direccion, values.NumPlazas, values.FechaInicio, values.FechaFin,values.indice];
        conexion.query(sql,inValues,function (err, result) {
            if(err){
               callback(err,null);
            }
            callback(null,values.indice);
        });
        conexion.release();
    });

}
function deleteCurso(values,callback) {
    pool.getConnection(function (err, conexion) {
        if (err) return;
        var sql = "DELETE FROM CURSOS WHERE idCURSO = (?)";
        var inValues = values;
        conexion.query(sql,inValues,function (err, result) {
            if(err){
               callback(err,null);
            }
            callback(null,values);
        });
        conexion.release();
    });
}
function getCurso(values,callback) {
    pool.getConnection(function (err, conexion) {
        if (err) return;
        var sql = "SELECT * FROM CURSOS  WHERE idCURSO = (?)";
        var inValues = values;
        conexion.query(sql,inValues,function (err, result) {
            if(err){
                callback(err,null);
            }
            callback(null,result);
        });
        conexion.release();
    });

}
function getHours(values,callback) {
    pool.getConnection(function (err, conexion) {
        if (err) return;
        var sql = "SELECT h.Dia,h.HoraInicio,h.HoraFin FROM CURSOS c " +
            "JOIN HORARIOS h ON c.idCURSO = h.idCURSO" +
            " WHERE c.idCURSO = (?)";
        var inValues = values;
        conexion.query(sql,inValues,function (err, result) {
            if(err){
                callback(err,null);
            }
            callback(null,result);
        });
        conexion.release();
    });

}
function findCurso(values,callback) {
    pool.getConnection(function (err, conexion) {
        if (err) return;
        var sql = "SELECT idCURSO, NombreCurso, Localidad, FechaInicio, FechaFin,NumPlazas " +
            "FROM CURSOS WHERE NombreCurso RLIKE (?) " +
            "ORDER BY FechaFin DESC LIMIT ?,?; ";
        var inValues = [values.name,Number(values.pos),Number(values.nMax)];
        conexion.query(sql,inValues,function (err, result) {
            if(err){
                callback(err,null);
            }
            callback(null,result);
        });
        conexion.release();
    });

}
function findAllCursos(values,callback) {
    pool.getConnection(function (err, conexion) {
        if (err) return;
        var sql = "SELECT COUNT(idCURSO) AS numCursos " +
            "FROM CURSOS WHERE NombreCurso RLIKE (?);";
        var inValues = [values.name];
        conexion.query(sql,inValues,function (err, result) {
            if(err){
                callback(err,null);
            }
            callback(null,result);
        });
        conexion.release();
    });

}