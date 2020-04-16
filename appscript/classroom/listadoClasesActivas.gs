/**
 * Lista las clases activas de un usuario.
 * Permite el volcado a hoja de cálculo o al log.
 *
 * v0.1 20200416 - Arreglado un bug que incluía las clases archivadas.
 */

function listadoClasesActivas() {
  /* Para limitar el número de clases. Se le pasaría como argumento a la función list
  var optionalArgs = {
    pageSize: 100
  };*/
  var listadoClases = Classroom.Courses.list();
  var clases = listadoClases.courses;
  
  // Salida a hoja de cálculo
  // var hoja = SpreadsheetApp.create("Salida códigos");
  
  Logger.log('Curso - Clase - Código');
  // hoja.appendRow(['Curso', 'Clase', 'Código']);
  var contador = 0;
  // Mostramos el detalle de cada clase
  if (clases && clases.length > 0) {  
    for (i = 0; i < clases.length; i++) {
      var clase = clases[i];
      if (clase.courseState != "ARCHIVED"){
        contador++;
        var curso = clase.name.split('-')[0];
        //hoja.appendRow([curso, clase.name, clase.enrollmentCode]);
        Logger.log('%s - %s - %s', curso, clase.name, clase.enrollmentCode);
      }
    }
    // Total de clases del usuario
    Logger.log('%d clases creadas', contador);
  } else {
    Logger.log('No he encontrado ninguna clase válida.');
  }
}
