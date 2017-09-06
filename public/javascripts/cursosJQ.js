"use strict"

$(document).ready(function () {
    $("#searchCursosBtn").on("click", function () {
        var name = $("#search-field").val();
        getNumCursos(name, function (err, result) {
            $("#pageNumber").data("num",0);
            $("#pageNumber").data("max",Math.round(result[0].numCursos/5+0.5));
            var max = $("#pageNumber").data("max");
            max--; //Don't know why it doesn't work to put it inside the .text(max-1)
            $("#pageNumber").data("name",name);
            $("#pageNumber").text($("#pageNumber").data("num")+"/"+max);
            getCursosLimit(name, 5, 0, function (err, result2) {
                if (err) {
                    alert(err);
                }
                else {
                    if (result2.length > 0) {
                        cursosDisplay(result2);
                    }
                }
            });
        });
    });

    function cursosDisplay(cursos) {
        $("#cursosTable").empty();
        cursos.forEach(function (curso) {
            var row = $("<tr id='cursoRow' data-idcurso='" + curso.idCURSO + "'>")
                .on("click", function () {
                    getCurso(curso.idCURSO, function (err, result) {
                        if (err) {
                            alert(err);
                        }
                        else {
                            if (result.length > 0) {
                                abrirVentana(result[0]);
                                console.log(result[0]);
                            }
                        }
                    });
                });
            $(row).append("<td>" + curso.NombreCurso + "</td>");
            $(row).append("<td>" + curso.Localidad + "</td>");
            $(row).append("<td>" + $.format.date(curso.FechaInicio, "dd/MM/yyyy") + "</td>");
            $(row).append("<td>" + $.format.date(curso.FechaFin, "dd/MM/yyyy") + "</td>");
            $(row).append("<td>" + curso.NumPlazas + "</td>");
            $(row).append("</tr>");
            $("#cursosTable").append(row);
        });
    }

    $("#prevPage").on("click",function () {
        var num = $("#pageNumber").data("num");
        var max = $("#pageNumber").data("max");
        var name = $("#pageNumber").data("name");
        if(num > 0){
            getCursosLimit(name, 5,(num-1)*5, function (err, result2) {
                if (err) {
                    alert(err);
                }
                else {
                    if (result2.length > 0) {
                        cursosDisplay(result2);
                        $("#pageNumber").data("num",num-1);
                        max--;
                        $("#pageNumber").text($("#pageNumber").data("num")+"/"+max);
                    }
                }
            });
        }
    });


    $("#nextPage").on("click",function () {
        var num = $("#pageNumber").data("num");
        var max = $("#pageNumber").data("max");
        var name = $("#pageNumber").data("name");
        if(num <= max){
            getCursosLimit(name, 5,(num+1)*5, function (err, result2) {
                if (err) {
                    alert(err);
                }
                else {
                    if (result2.length > 0) {
                        cursosDisplay(result2);
                        $("#pageNumber").data("num",num+1);
                        max--;
                        $("#pageNumber").text($("#pageNumber").data("num")+"/"+max);
                    }
                }
            });
        }
    });

    function abrirVentana(curso) {
        $("#cursoName").text(curso.NombreCurso);
        $("#cursoDesc").text(curso.Descripcion);
        $("#cursoLugar").text(curso.Direccion);
        $("#cursoCiudad").text(curso.Localidad);
        $("#cursoDura").text(" Desde " + $.format.date(curso.FechaInicio, "dd/MM/yyyy") + " Hasta " + $.format.date(curso.FechaFin, "dd/MM/yyyy"));
        $("#cursoPlaza").text(curso.NumPlazas);
        curso.hours.forEach(function(hora){
            $("#cursoHours").append(" "+ hora.Dia + " " + hora.HoraInicio + " " + hora.HoraFin + " ");
        });
        $("#ventanaCurso").show();
    }

    function cerrarVentana() {
        $("#ventanaCurso").hide();
    }


    $(document).ready(function () {
        $("#mostrarVentana").on("click", abrirVentana);
        $("#cerrar").on("click", cerrarVentana);
    });

    function getCursosLimit(name, nMax, pos, callback) {
        $.ajax({
            type: "GET",
            url: "/cursos",
            data: {
                "name": name,
                "nMax": nMax,
                "pos": pos
            },
            success: function (data, textStatus, jqXHR) {
                console.log(textStatus);
                callback(null, data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                callback(new Error("ERROR " + errorThrown), null);
            }
        });
    }

    function getNumCursos(name, callback) {
        $.ajax({
            type: "GET",
            url: "/cursosAll",
            data: {
                "name": name
            },
            success: function (data, textStatus, jqXHR) {
                console.log(textStatus);
                callback(null, data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                callback(new Error("ERROR " + errorThrown), null);
            }
        });
    }

    function getCurso(id, callback) {
        $.ajax({
            type: "GET",
            url: "/cursos/" + id,
            success: function (data, textStatus, jqXHR) {
                console.log(textStatus);
                callback(null, data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                callback(new Error("ERROR " + errorThrown), null);
            }
        });
    }
});
