$(document).ready(function () {
    $("#searchCursosBtn").on("click", function () {
        var name = $("#formBuscarCurso").val(); //TODO Error: ER_SP_UNDECLARED_VAR: Undeclared variable: NaN con boton de busqueda
        getCursosLimit(name, 5, 0, function (err, result) {
            if (err) {
                alert(err);
            }
            else {
                if (result > 0) {
                    cursosDisplay(cursos);
                }
            }
        });
    });

    function cursosDisplay(cursos) {
        // $(".cursoRow").remove(); //TODO arreglar esto
        cursos.forEach(function (curso) {
            var row = $("<tr class='cursoRow'>");
            $(row).append("<td class='dataCurso' data-idcurso='" + curso.idCURSO + "'>" + curso.Titulo + "</td>");
            $(row).append("<td class='dataCurso' data-idcurso='" + curso.idCURSO + "'>" + curso.Localidad + "</td>");
            $(row).append("<td class='center dataCurso' data-idcurso='" + curso.idCURSO + "'>" + extraerFecha(curso.FechaInicio) + "</td>");
            $(row).append("<td class='center dataCurso' data-idcurso='" + curso.idCURSO + "'>" + extraerFecha(curso.FechaFin) + "</td>");
            $(row).append("</tr>");
            $("#cursosTable").append(row);
        });
    }

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

//TODO para Implementar con varias paginas....
    function getAllCourses(busq, callback) {
        $.ajax({
            type: "GET",
            url: "/cursos/" + search,
            success: function (data, textStatus, jqXHR) {
                console.log(textStatus);
                callback(null, data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                callback(new Error("ERROR" + errorThrown), null);
            }
        });
    }
});