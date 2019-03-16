"use strict";
function CreateDB(){
  var request = indexedDB.open("vs");
  var db;

  request.onerror = function (e) {
      alert('Error cargando la base de datos');
  };

  request.onsuccess = function (event) {
      alert("request.onsuccess");
      db = request.result;

      db.onerror = function (event) {
          // Generic error handler for all errors targeted at this database's
          // requests!
          alert("Database error: " + event.target.errorCode);
      };
      /*db = event.target.result;
      var objectStore = db.createObjectStore("categories");
      objectStore = db.createObjectStore("actors");
      objectStore = db.createObjectStore("directors");
      objectStore = db.createObjectStore("productions");
      objectStore.transaction.oncomplete = function (event) {
        console.log("Objetos creados");
      }*/

  };
  
  request.onupgradeneeded = function (event) {
      alert("conectar");

      db = event.target.result;
      var objectStore = db.createObjectStore("categories");
      objectStore = db.createObjectStore("actors");
      objectStore = db.createObjectStore("directors");
      objectStore = db.createObjectStore("productions");

      objectStore.transaction.oncomplete = function (event) {
          /*var categorias = vs.categorias;
          var categoria = categorias.next();
          var categoryObjectStore = db.transaction("categories", "readwrite").objectStore("categories");
          while (categoria.done !== true) {
              categoryObjectStore.add(category.value.getObject(), category.value.name);
              categoria = categorias.next();
          }

          var actors = vs.actors;
          var actor = actors.next();
          var actorObjectStore = db.transaction("actors", "readwrite").objectStore("actors");
          while (actor.done !== true) {
              actorObjectStore.add(actor.value.getObject(), actor.value.name + " " + actor.value.lastname);
              actor = actors.next();
          }

          var directores = vs.directores;
          var director = directores.next();
          var directorObjectStore = db.transaction("directors", "readwrite").objectStore("directors");
          while (director.done !== true) {
              directorObjectStore.add(director.value.getObject(), director.value.name + " " + director.value.lastname);
              director = directores.next();
          }

          var productions = vs.productions;
          var production = productions.next();
          var productionObjectStore = db.transaction("productions", "readwrite").objectStore("productions");
          while (production.done !== true) {
              productionObjectStore.add(production.value.getObject(), production.value.title);
              production = productions.next();
          }*/
      }
      

  };
}
function addDB(obj, store, key) {
  var db;
  var request = indexedDB.open("vs");

  request.onerror = function (event) {
      alert("Fallo en el addDB");
  };

  request.onsuccess = function (event) {
      db = event.target.result;
      db.onerror = function (event) {
          // Generic error handler for all errors targeted at this database's
          // requests!
          console.log("Database error: " + event.target.error);
      };


      var transaction = db.transaction([store], "readwrite");
      var objectStore = transaction.objectStore(store);
      var request2 = objectStore.add(obj.getObject(), key);
      request2.onsuccess = function (event) {
          console.log(event.target.result);
      };
  };
}
function delDB(store, key) {
  var db;
  var request = indexedDB.open("vs");

  request.onerror = function (event) {
      alert("Fallo en el delDB");
  };

  request.onsuccess = function (event) {
      db = event.target.result;
      db.onerror = function (event) {
          alert("Database error: " + event.target.error);
      };

      var transaction = db.transaction([store], "readwrite");
      var objectStore = transaction.objectStore(store);
      var request2 = objectStore.delete(key);
      request2.onsuccess = function (event) {
          //
      };
  };
}
