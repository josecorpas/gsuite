/*
 * getAllCourses()
 * 
 * Devuelve un listado con todas las clases bajo la cuenta.
 * Dichas clases se pueden encontrar en cualquier estado.
 */

function getAllCourses() {
  var optionalArgs = {
    //pageSize: 10
  }
  var response = Classroom.Courses.list(optionalArgs);
  var clases = response.courses;
  var hoja = SpreadsheetApp.openById('1x4vo89kQKrIBb9YJuqM6PpscXmIi7680dxvt23pLfYE').getSheetByName('Todas'); 
  
  // Limpio la hoja para comenzar
  hoja.clear();
  
  // Aplico formato a la hoja
  this.setFormat('Todas');
  
  // Fila de encabezados
  hoja.appendRow(['Estado','Nombre clase','Profesor']);
  
  if (clases && clases.length > 0) {
    for (i = 0; i < clases.length; i++){
      var clase = clases[i];
      var profesor =  Classroom.UserProfiles.get(clase.ownerId);
      hoja.appendRow([clase.courseState, clase.name, profesor.emailAddress]); 
    }
  }
}

/*
 * getActiveCourses()
 * 
 * Devuelve un listado con todas las clases activas bajo la cuenta junto al número de alumnos que tienen.
 * Los datos que devuelven alimentan la hoja de gráficas con gráfico de barras y tabla dinámica.
 */

function getActiveCourses() {
  var optionalArgs = {
    //pageSize: 10
  }
  var response = Classroom.Courses.list(optionalArgs);
  var clases = response.courses;
  var hoja = SpreadsheetApp.openById('1x4vo89kQKrIBb9YJuqM6PpscXmIi7680dxvt23pLfYE').getSheetByName('Activas');
  
  // Limpio la hoja para comenzar
  hoja.clear();
  
  // Aplico formato a la hoja
  this.setFormat('Activas');
  
  // Fila de encabezados
  hoja.appendRow(['Nombre clase','Profesor','Fecha Creación','NºAlumnos']);
  
  if (clases && clases.length > 0) {
    for (i = 0; i < clases.length; i++){
      var clase = clases[i];
      if (clase.courseState == 'ACTIVE') {
        var profesor =  Classroom.UserProfiles.get(clase.ownerId);
        var diaCreacion =  clase.creationTime.split('T')[0];
        var rAlumnos = Classroom.Courses.Students.list(clase.id);
        var alumnos = rAlumnos.students; 
        if (alumnos && alumnos.length > 0){
          hoja.appendRow([clase.name, profesor.emailAddress, diaCreacion, alumnos.length]);
        }
      }
    }
  }
  
  hoja.setFrozenRows(1);
  //hoja.autoResizeColumns(1,3);
  hoja.getRange('C1:D1000')
  .setHorizontalAlignment('center');
  // Ordeno los datos por fecha ascendente
  hoja.sort(3,true);
}

/*
 * getSummary()
 * 
 * Devuelve un resumen estadístico de las clases activas.
 */
 
function getSummary(){
  var hoja = SpreadsheetApp.openById('1x4vo89kQKrIBb9YJuqM6PpscXmIi7680dxvt23pLfYE').getSheetByName('Resumen');
  
  var responseClases = Classroom.Courses.list();
  var clases = responseClases.courses;
  
  Logger.log('Clases: %s', clases.length);
  
  if (clases && clases.length > 0) {
    for (i = 0; i < clases.length; i++){
      var clase = clases[i];
      if (clase.courseState == 'ACTIVE') {
        var rAlumnos = Classroom.Courses.Students.list(clase.id);
        var alumnos = rAlumnos.students; 
        if (alumnos && alumnos.length > 0){
          Logger.log('%s - alumnos: %s', clase.name, alumnos.length);
        }
      }
    }
  }
}

/*
 * setFormat(hoja)
 *
 * Aplica formato a la hoja que le paso como parámetro
 */

function setFormat(hoja){
  var sheet = SpreadsheetApp.openById('1x4vo89kQKrIBb9YJuqM6PpscXmIi7680dxvt23pLfYE').getSheetByName(hoja);
  var range = sheet.getRange('A1:D1000');
  
  var rule1 = SpreadsheetApp.newConditionalFormatRule()
  .whenTextEqualTo("ACTIVE")
  .setBackground("#5ef044")
  .setRanges([range])
  .build();
  
  var rule2 = SpreadsheetApp.newConditionalFormatRule()
  .whenTextEqualTo("ARCHIVED")
  .setBackground("#ca1212")
  .setRanges([range])
  .build();
   
  var rules = sheet.getConditionalFormatRules();
  rules.push(rule1);
  rules.push(rule2);
  sheet.setConditionalFormatRules(rules);
  
  range.applyRowBanding(SpreadsheetApp.BandingTheme.BROWN);
  
  // Establezco tipo de letra
  sheet.getRange('A1:D1000')
  .setFontFamily('Calibri')
  
  
  //Cambio los encabezados
  sheet.getRange('A1:D1')
  .setBackground("#FFCC00")
  .setFontWeight("bold");  
}