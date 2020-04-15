/**
 * Lista las clases activas de un usuario.
 * Permite el volcado a hoja de cálculo o al log.
 */
function listadoClasesActivas() {
  /* Para limitar el número de clases. Se le pasaría como argumento a la función list
  var optionalArgs = {
    pageSize: 100
  };*/
  var listadoClases = Classroom.Courses.list();
  var clases = listadoClases.courses;
  
  // Salida a hoja de cálculo
  var hoja = SpreadsheetApp.create("Salida códigos");
  // Total de clases del usuario
  Logger.log('%s clases creadas', clases.length); 
  Logger.log('Curso - Clase - Código');
  hoja.appendRow(['Curso', 'Clase', 'Código']);
  // Mostramos el detalle de cada clase
  if (clases && clases.length > 0) {
    for (i = 0; i < clases.length; i++) {
      var clase = clases[i];
      var curso = clase.name.split('-')[0];
      hoja.appendRow([curso, clase.name, clase.enrollmentCode]);
      Logger.log('%s - %s - %s', curso, clase.name, clase.enrollmentCode);
    }
  } else {
    Logger.log('No he encontrado ninguna clase válida.');
  }
}
