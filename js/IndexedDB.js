"use strict";
function CreateDB(){
    var db;
    var request = indexedDB.open("VS", 3);
    
    request.onerror = function(event) {  
      alert("Error cargando la BD");
    };
    
    request.onsuccess = function(event) {
      // I get a DB to use it in my students form.
      db = request.result;
      db.onerror = function(event) {
        // Generic error handler for all errors targeted at this database's
        // requests!
        alert("Error en el acceso a la base de datos: " + event.target.errorCode);
      };
    };        
    request.onupgradeneeded = function(event) {  
        db = event.taget.result;
        console.log("Event onupgradeneeded: " + db.name);
        try {
          console.log("Hola");
            // Create an objectStore with autoincrement key    
            var objectStore = db.createObjectStore("directores", { autoIncrement : true });
            var objectStore = db.createObjectStore("actores", { autoIncrement : true });
            var objectStore = db.createObjectStore("categorias", { autoIncrement : true });
            var objectStore = db.createObjectStore("productions", { autoIncrement : true });
            console.log ("Object Store has been created");
        
            // Use transaction oncomplete to make sure the objectStore creation is 
            // finished before adding data into it.
            objectStore.transaction.oncomplete = function(event) {
                console.log("Everythings is okey");
            }
            objectStore.transaction.onerror = function(event) {
              console.log("No se han creado los almacenes");
          }
        } catch (e) {
            console.log("Exception creating object store: " + e);
        }
    }; 
    this.addDirectorDB=function(director){
        var DB_STORE_NAME= "directores";
        console.log(db);
        var transaction = db.transaction([DB_STORE_NAME], "readwrite");
        transaction.onerror = function(event) {
            document.getElementById("error").appendChild(document.createTextNode("Error. No se ha creado el director en la base de datos: " + event.target.error + "<br/>"));
        };
            
        var objectStore = transaction.objectStore(DB_STORE_NAME);  
            
        // I add the new Director to object store
        var request = objectStore.add(director);
        request.onsuccess = function(event) {
            //document.getElementById("result").appendChild(document.createTextNode("Se ha creado el nuevo director: " + director));
            console.log("Director add to object store: " + director.name + " with key " + event.target.result);
        };
       
    }
    this.addActorDB=function(actor){
      var DB_STORE_NAME= "actores";
      console.log(db);
      var transaction = db.transaction([DB_STORE_NAME], "readwrite");
      transaction.onerror = function(event) {
          document.getElementById("result").appendChild(document.createTextNode("Error. No se ha creado el actor en la base de datos: " + event.target.error + "<br/>"));
      };
          
      var objectStore = transaction.objectStore(DB_STORE_NAME);  
          
      // I add the new Actor to object store
      var request = objectStore.add(actor);
      request.onsuccess = function(event) {
          document.getElementById("result").appendChild(document.createTextNode("Se ha creado el nuevo actor: " + actor));
          console.log("Actor add to object store: " + actor.name + " with key " + event.target.result);
      };
     
    }
  this.addCategoryDB=function(categoria){
    var DB_STORE_NAME= "categorias";

    var transaction = db.transaction([DB_STORE_NAME], "readwrite");
    transaction.onerror = function(event) {
        document.getElementById("result").appendChild(document.createTextNode("Error. No se ha creado la categoría en la base de datos: " + event.target.error + "<br/>"));
    };
        
    var objectStore = transaction.objectStore(DB_STORE_NAME);  
        
    // I add the new Category to object store
    var request = objectStore.add(categoria);
    request.onsuccess = function(event) {
        document.getElementById("result").appendChild(document.createTextNode("Se ha creado el nuevo estudiante: " + categoria));
        console.log("Director add to object store: " + categoria.name + " with key " + event.target.result);
    };
   
  }
  this.addProductionDB=function(production){
    var DB_STORE_NAME= "productions";

    var transaction = db.transaction([DB_STORE_NAME], "readwrite");
    transaction.onerror = function(event) {
        document.getElementById("result").appendChild(document.createTextNode("Error. No se ha creado la categoría en la base de datos: " + event.target.error + "<br/>"));
    };
        
    var objectStore = transaction.objectStore(DB_STORE_NAME);  
        
    // I add the new Production to object store
    var request = objectStore.add(production);
    request.onsuccess = function(event) {
        document.getElementById("result").appendChild(document.createTextNode("Se ha creado la nueva producción: " + production));
        console.log("Production add to object store: " + production.title + " with key " + event.target.result);
    };
   
  }
}