"use strict";
function CreateDB(){
    //crearObjetos();
    //He leido que si no pones verisón, el navegador pone el que el tiene por defecto y así nunca de fallo.
    var request = indexedDB.open("vs");
    var db;
    //mensaje por si ha abido algún error al abrir
    request.onerror = function (e) {
        alert('Error cargando la base de datos');
    };
    
    request.onsuccess = function (event) {
        //request.result es una instancia de IDBDatabase
        db = request.result;
        db.onerror = function (event) {
            alert("Database error: " + event.target.errorCode);
        };
        //Si todo va bien en cargar la bbdd:
        db.onsuccess = function(event){
            console.log("cargada la bbdd");
        }

    };
    //Evento que se ejecuta la primera vez que se conecta ("como el constructor").
    request.onupgradeneeded = function (event) {
        db = event.target.result;
        //Para ver que no es undefined:
        console.log("Nombre de la base de datos: "+ db.name);
        //Creo los diferentes almacenes para almacenar (jajaja) la info y tenerla separada y ordenada.
        var objectStore = db.createObjectStore("categories");
        objectStore = db.createObjectStore("directors");
        objectStore = db.createObjectStore("actors");
        objectStore = db.createObjectStore("productions");
        //console.log("Hola, he creado los stores");
        //Si se crean bien meto la info que tengo en los arrays en la bbdd.
        objectStore.transaction.oncomplete = function (event) {
            //console.log("Hola, he metido los arrays");
            var categorias = vs.categorias;
            var categoria = categorias.next();
            //Este es el objeto donde le digo en que almacen meterlo
            var cObjectStore = db.transaction("categories", "readwrite").objectStore("categories");
            while (categoria.done !== true) {
                //Añado el objeto y la clave
                cObjectStore.add(categoria.value.getObject(), categoria.value.name);
                categoria = categorias.next();
            }

            var actors = vs.actors;
            var actor = actors.next();
            var aObjectStore = db.transaction("actors", "readwrite").objectStore("actors");
            while (actor.done !== true) {
                aObjectStore.add(actor.value.getObject(), actor.value.name + " " + actor.value.lastname1);
                //console.log("Nombre del actor en onup "+ actor.value.name);
                actor = actors.next();
            }

            var directores = vs.directores;
            var director = directores.next();
            var dObjectStore = db.transaction("directors", "readwrite").objectStore("directors");
            while (director.done !== true) {
                dObjectStore.add(director.value.getObject(), director.value.name + " " + director.value.lastname1);
                director = directores.next();
            }

            var productions = vs.productions;
            var production = productions.next();
            var pObjectStore = db.transaction("productions", "readwrite").objectStore("productions");
            while (production.done !== true) {
                pObjectStore.add(production.value.getObject(), production.value.title);
                production = productions.next();
            }
            console.log("ObjestStore creados y completado");
        }
        

    };
}
//He hecho un añadir generico porque siempre es igual, lo único que cambia es el nombre del almacen y si me lo pasan
//pues no tengo que hacer 4 diferentes.
function addDB(elemt, storeName, key) {
    var db;
    var request = indexedDB.open("vs");

    request.onerror = function (event) {
        alert("Fallo en el addDB");
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            alert("Database error: " + event.target.error);
        };

        var objectStore = db.transaction([storeName], "readwrite").objectStore(storeName);
        var request2 = objectStore.add(elemt.getObject(), key);
        request2.onsuccess = function (event) {
            //Le digo al usuario que se ha añadido correctamente el elemento que me ha pasado.
            var div1 = document.getElementById("mostrarResult");
            removeChildren(div1);
            var p = document.createElement("h4");
            p.appendChild(document.createTextNode("Se ha añadido el elemento: "+ elemt));
            div1.appendChild(p);
            console.log("Se ha añadido correctamente: " + event.target.result);
        };
    };
}
//No necesito el elemento, porque con la clave (como el id), es único y así lo identifico y borro.
function deltDB(storeName, key) {
    var db;
    var request = indexedDB.open("vs");
    console.log(storeName);
    console.log(key);
    request.onerror = function (event) {
        alert("Fallo en deltDB");
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            alert("Database error: " + event.target.error);
        };
        //objectStore es la operación que quiere hacer de que tipo y en que almacen.
        var objectStore = db.transaction([storeName], "readwrite").objectStore(storeName);
        //para borrar el elemento solo necesita la clave, como es única lo busca y elimina.
        var request2 = objectStore.delete(key);
        request2.onsuccess = function (event) {
            //Le digo al usuario que se ha eliminado correctamente el elemento que me ha pasado.
            var div1 = document.getElementById("mostrarResult");
            removeChildren(div1);
            var p = document.createElement("h4");
            p.appendChild(document.createTextNode("Se ha eliminado el elemento: "+ key));
            div1.appendChild(p);
            console.log("Se ha eliminado el elemento: "+ key);
        };
    };
}
function modDBPerson(storeName, key){
    var db;
    var request = indexedDB.open("vs");
    console.log(storeName);
    request.onerror = function (event) {
        alert("Fallo en modDBPerson");
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            alert("Database error: " + event.target.error);
        };

        var objectStore = db.transaction([storeName], "readwrite").objectStore(storeName);
        var request2 = objectStore.get(key);
        console.log(request2);
        request2.onerror = function (event) {
            alert("Error en modDBPerson request2");
        };
        request2.onsuccess = function (event) {
            // Cogemos el valor antiguo
            var data = request2.result;
            //console.log(data);
            // Actualizamos el valor 
            data.name = document.forms["dirForm"]["name"].value;
            data.lastname1 = document.forms["dirForm"]["lastname1"].value;
            data.born = new Date(document.forms["dirForm"]["born"].value);

            for (var i in productions) {
                var obj = { title: productions[i].title, publication: productions[i].publication, image: productions[i].image };
                data.productions.push(obj);
            }

            var requestMo = objectStore.put(data, data.name + " " + data.lastname1);
            requestMo.onerror = function (event) {
                // Do something with the error
            };
            requestMo.onsuccess = function (event) {
                //Le digo al usuario que se ha modificado correctamente el elemento que me ha pasado.
                var div1 = document.getElementById("mostrarResult");
                removeChildren(div1);
                var p = document.createElement("h4");
                p.appendChild(document.createTextNode("Se ha modificado el elemento: "+ key +" por "+ data.name +" "+data.lastname1));
                div1.appendChild(p);
                console.log("Se ha modificado el elemento: "+ key);
            };
        };
    };

}

function modDBCategory(key) {
    var db;
    var request = indexedDB.open("vs");
    request.onerror = function (event) {
        alert("Fallo en modDBCategory");
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            alert("Database error: " + event.target.error);
        };

        var objectStore = db.transaction(["categories"], "readwrite").objectStore("categories");
        var request2 = objectStore.get(key);
        console.log(request2);
        request2.onerror = function (event) {
            alert("Error en modDBCategory request2");
        };
        request2.onsuccess = function (event) {
            // Cogemos el valor antiguo
            var data = request2.result;
            //console.log(data);
            // Actualizamos el valor 
            data.name = document.forms["catForm"]["name"].value;
            data.description = document.forms["catForm"]["description"].value;
            for (var i in productions) {
                var obj = { title: productions[i].title, publication: productions[i].publication, image: productions[i].image };
                data.productions.push(obj);
            }

            var requestMo = objectStore.put(data, data.name);
            requestMo.onerror = function (event) {
                // Do something with the error
            };
            requestMo.onsuccess = function (event) {
                //Le digo al usuario que se ha modificado correctamente el elemento que me ha pasado.
                var div1 = document.getElementById("mostrarResult");
                removeChildren(div1);
                var p = document.createElement("h4");
                p.appendChild(document.createTextNode("Se ha modificado el elemento: "+ key +" por "+ data.name +" "+data.lastname1));
                div1.appendChild(p);
                console.log("Se ha modificado el elemento: "+ key);
            };
        };
    };
}
/*function volcarDB() {
    var db;
    var request = indexedDB.open("video", 1);

    request.onerror = function (event) {
        alert("Fallo en el volcarDB");
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            alert("Database error: " + event.target.error);
        };

        var transaction = db.transaction(["categories"], "readwrite");
        var objectStore = transaction.objectStore("categories");
        var request2 = objectStore.getAll();
        request2.onerror = function (event) {
            alert("Error en volcarDB");
        };
        request2.onsuccess = function (event) {
            var data = request2.result;
            for (var i in data) {
                var cats = vs.categorias;
                var category = cats.next();
                var found = false;

                while (category.done !== true && found != true) {
                    if (category.value.name === data[i].name) {
                        found = true;
                    }
                    category = cats.next();
                }
                if (found != true) {
                    var cat = new Category(data[i].name);
                    cat.description = data[i].description;
                    vs.addCategory(cat);
                    var prods = cat.productions;
                    for (var i in prods){
                        var pro = new Movie (prods[i].title, prods[i].publication);
                        pro.image = prods[i].image;
                        vs.assignCategory(cat, pro);
                    }
                }
            }
        }

        transaction = db.transaction(["actors"], "readwrite");
        objectStore = transaction.objectStore("actors");
        var request3 = objectStore.getAll();
        request3.onerror = function (event) {
            alert("Error en volcarDB");
        };
        request3.onsuccess = function (event) {
            var data = request3.result;
            console.log("data actors "+data.name);
            for (var i in data) {
                var acts = vs.actors;
                var actor = acts.next();
                var found = false;

                while (actor.done !== true && found != true) {
                    if (actor.value.name === data[i].name) {
                        found = true;
                    }
                    actor = acts.next();
                }
                if (found != true) {
                    var act = new Person(data[i].name, data[i].lastname, "" ,data[i].born);
                    act.picture = data[i].picture;
                    act.productions = data[i].productions;
                    vs.addActor(act);
                    var prods = act.productions;
                    for (var i in prods){
                        var pro = new Movie (prods[i].title, prods[i].publication);
                        pro.image = prods[i].image;
                        vs.assignActor(act, pro);
                    }
                }
            }
        }

        transaction = db.transaction(["directors"], "readwrite");
        objectStore = transaction.objectStore("directors");
        var request4 = objectStore.getAll();
        request4.onerror = function (event) {
            alert("Error en volcarDB");
        };
        request4.onsuccess = function (event) {
            var data = request4.result;
            for (var i in data) {
                var dirs = vs.directores;
                var director = dirs.next();
                var found = false;

                while (director.done !== true && found != true) {
                    if (director.value.name === data[i].name) {
                        found = true;
                    }
                    director = dirs.next();
                }
                if (found != true) {
                    var dir = new Person(data[i].name, data[i].lastname, "", data[i].born);
                    dir.picture = data[i].picture;
                    dir.productions = data[i].productions;
                    vs.addDirector(dir);
                    var prods = dir.productions;
                    for (var i in prods){
                        var pro = new Movie (prods[i].title, prods[i].publication);
                        pro.image = prods[i].image;
                        vs.assignDirector(dir, pro);
                    }
                }
            }
        }
    }
}*/

/*function sacarProd(ob, type) {
    if (type == "actor") {
        var productions = vs.getProductionsActor(ob);
        var production = productions.next();
        var arrProductions = [];

        while (production.done !== true) {
            arrProductions.push(production.value);
            production = productions.next();
        }

        var db;
        var request = indexedDB.open("video", 1);

        request.onerror = function (event) {
            alert("Fallo en el updDB");
        };

        request.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                alert("Database error: " + event.target.error);
            };

            var transaction = db.transaction(["actors"], "readwrite");
            var objectStore = transaction.objectStore("actors");
            var request2 = objectStore.get(ob.name + " " + ob.lastname);
            request2.onerror = function (event) {
                alert("Error en updDB");
            };
            request2.onsuccess = function (event) {

                var data = request2.result;
                data.name = ob.name;
                data.lastname = ob.lastname;
                data.born = ob.born;
                for (var i in arrProductions) {
                    var objP = { title: arrProductions[i].title, publication: arrProductions[i].publication, image: arrProductions[i].image };
                    data.productions.push(objP);
                }

                var requestUpdate = objectStore.put(data, data.name + " " + data.lastname);
                requestUpdate.onerror = function (event) {
                    // Do something with the error
                };
                requestUpdate.onsuccess = function (event) {
                    // Success - the data is updated!
                };
            };
        };
    }

    if (type == "director") {
        var productions = vs.getProductionsDirector(ob);
        var production = productions.next();
        var arrProductions = [];

        while (production.done !== true) {
            arrProductions.push(production.value);
            production = productions.next();
        }

        var db;
        var request = indexedDB.open("video", 1);

        request.onerror = function (event) {
            alert("Fallo en el updDB");
        };

        request.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                alert("Database error: " + event.target.error);
            };

            var transaction = db.transaction(["directors"], "readwrite");
            var objectStore = transaction.objectStore("directors");
            var request2 = objectStore.get(ob.name + " " + ob.lastname);
            request2.onerror = function (event) {
                alert("Error en updDB");
            };
            request2.onsuccess = function (event) {
                var data = request2.result;
                // Actualizamos el valor 
                data.name = ob.name;
                data.lastname = ob.lastname;
                data.born = ob.born;
                for (var i in arrProductions) {
                    var objP = { title: arrProductions[i].title, publication: arrProductions[i].publication, image: arrProductions[i].image };
                    data.productions.push(objP);
                }

                var requestUpdate = objectStore.put(data, data.name + " " + data.lastname);
                requestUpdate.onerror = function (event) {
                    // Do something with the error
                };
                requestUpdate.onsuccess = function (event) {
                    // Success - the data is updated!
                };
            };
        };
    }
    if (type == "category") {
        var productions = vs.getProductionsCategory(ob);
        var production = productions.next();
        var arrProductions = [];

        while (production.done !== true) {
            arrProductions.push(production.value);
            production = productions.next();
        }

        var db;
        var request = indexedDB.open("video", 1);

        request.onerror = function (event) {
            alert("Fallo en el updDB");
        };

        request.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                alert("Database error: " + event.target.error);
            };

            var transaction = db.transaction(["categories"], "readwrite");
            var objectStore = transaction.objectStore("categories");
            var request2 = objectStore.get(ob.name);
            request2.onerror = function (event) {
                alert("Error en updDB");
            };
            request2.onsuccess = function (event) {
                var data = request2.result;
                // Actualizamos el valor 
                data.name = ob.name;
                data.description = ob.description;
                for (var i in arrProductions) {
                    var objP = { title: arrProductions[i].title, publication: arrProductions[i].publication, image: arrProductions[i].image };
                    data.productions.push(objP);
                }

                var requestUpdate = objectStore.put(data, data.name);
                requestUpdate.onerror = function (event) {
                    // Do something with the error
                };
                requestUpdate.onsuccess = function (event) {
                    // Success - the data is updated!
                };
            };
        };
    }
}*/