"use strict";

var connDB = require('./connDB');

module.exports ={
    addCurso: addCurso,
    editCurso: editCurso,
    deleteCurso: deleteCurso,
    getCurso: getCurso,
    findCurso:findCurso
};

function addCurso(data,callback) {
    if(data!== null && data !==undefined){
        connDB.insertCurso(data,function (err,idCURSOS) {
            if(err){
                callback(err,null);
            }
            else{
                callback(null,idCURSOS);
            }
        });
        
    }
}
function editCurso(data,callback) {
    if(data!== null && data !==undefined){
        connDB.editCurso(data,function (err,idCURSOS) {
            if(err){
                callback(err,null);
            }
            else{
                callback(null,idCURSOS);
            }
        });

    }
}
function deleteCurso(data,callback) {
    if(data!== null && data !==undefined){
        connDB.deleteCurso(data,function (err,idCURSOS) {
            if(err){
                callback(err,null);
            }
            else{
                callback(null,idCURSOS);
            }
        });

    }
}
function getCurso(data,callback) {
    if(data!== null && data !==undefined){
        connDB.getCurso(data,function (err,result) {
            if(err){
                callback(err,null);
            }
            else{
                callback(null,result);
            }
        });

    }
}
function findCurso(data,callback) {
    if(data!== null && data !==undefined){
        connDB.findCurso(data,function (err,result) {
            if(err){
                callback(err,null);
            }
            else{
                callback(null,result);
            }
        });

    }
}


