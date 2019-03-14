"use strict";
function CreateDB(DB_NAME, DB_VERSION){
    var db;
    var request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = function(event) {  
      document.getElementById("error").appendChild(document.createTextNode("Error en la solicitud: " + event.target.error + "<br/>"));
    };
    
    request.onsuccess = function(event) {
      // I get a DB to use it in my students form.
      db = event.target.result;
      db.onerror = function(event) {
        // Generic error handler for all errors targeted at this database's
        // requests!
        document.getElementById("error").appendChild(document.createTextNode("Error en el acceso a la base de datos: " + event.target.error + "<br/>"));
      };
    };

    this.createDirectorsTable = function (){
        var DB_STORE_NAME= "directores";
        
        request.onupgradeneeded = function(event) {  
            db = event.target.result;
            console.log("Event onupgradeneeded: " + db.name);
          try {
            // Create an objectStore with autoincrement key    
            var directorsObjectStore = db.createObjectStore(DB_STORE_NAME, { autoIncrement : true });
            console.log ("Director Object Store has been created");
        
            // Use transaction oncomplete to make sure the objectStore creation is 
            // finished before adding data into it.
            /*directorsObjectStore.transaction.oncomplete = function(event) {
              // Store values in the newly created objectStore.
              /*var directorsObjectStore = db.transaction(DB_STORE_NAME, "readwrite").objectStore(DB_STORE_NAME);

              var directores = vs.directores;
              var director = directores.next();

              while (director.done !== true){
                directorsObjectStore.add(director.value.getObject());
                console.log("director add to object store: " + director.value.name);
                director = directores.next();
              }
              
             console.log("Everythings is okey");
          }*/
          } catch (e) {
            console.log("Exception creating object store: " + e);
          }
        }; 
    }
    this.addDirectorDB=function(director){
        console.log("addDirectorDB");
        return function(event){
            var DB_STORE_NAME= "directores";
            console.log("Nombre del director añadido: "+ director.name);
            var transaction = db.transaction([DB_STORE_NAME], "readwrite");
            transaction.onerror = function(event) {
                document.getElementById("error").appendChild(document.createTextNode("Error. No se ha creado el estudiante en la base de datos: " + event.target.error + "<br/>"));
            };
            
            var directorsObjectStore = transaction.objectStore(DB_STORE_NAME);  
            
            // I add the new Director to object store
            var request = directorsObjectStore.add(director);
            console.log("Nombre del director añadido: "+ director.name);
            request.onsuccess = function(event) {
                document.getElementById("result").appendChild(document.createTextNode("Se ha creado el nuevo estudiante: " + director));
                console.log("Director add to object store: " + director.name + " with key " + event.target.result);
            };

        }
        
                
    }
}