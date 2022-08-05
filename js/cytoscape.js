
/**
 * @autor Cristian Duvan Machado Mosquera <cristian.machado@correounivalle.edu.co>
 * @des obtener los elementos del json
 * @returns json
 */
const elements_array = async (name) => {

    const res = await fetch(`js/${name}.json`)
    const data = await (res).json()

    if (res.ok) {

        return data

    }

}


/**
 * @autor Cristian Duvan Machado Mosquera <cristian.machado@correounivalle.edu.co>
 * @des pintar en nodos la jerarquia de los profecionales,monitores,estudiantes
 * !no olvidar subir esto al campus y probarlo en el servidor de prueba y la ruta previamente creada en el campus
 * TODO: falta hacer las funciones para que calculen la jerarquia y las posicones 
 * TODO: falta la consulta a la base de datos del campus univalle
 * ?El algotrimo que los acomoda por defecto es de la misma libreria pero el orden en el que los va mostar si toca programarlo
 * ?me preocupa es la forma en la que van a salir de la base de datos mas que todo por la estrutura que espera cytoscape
 */
var cy = cytoscape({
    elements: elements_array('elements'),
    style: elements_array('style'),
    layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 10
    },
    boxSelectionEnabled: false,
    autounselectify: true,
    container: document.getElementById('nodo-plugging')
})



/**
 * @autor Cristian Duvan Machado Mosquera <cristian.machado@correounivalle.edu.co>
 * @des definir la jerarquia
 */
function jerarquia_cytoscpae() {

}

//objecto para guardar los nodos y sus relaciones que fueron borrados
let object_nodes = new Object()

/**
 *  @modificacion_por Cristian Duvan Machado Mosquera <cristian.machado@correounivalle.edu.co>
 *  @nuevo ahora al dar click en un nodo despues de haberlo guardado y sacado del array de nodos, lo vuelve a poner en el grafo
 *  funcion por defecto de cytoscape hecha por @author: https://cytoscape.org/
 */
cy.on('tap', 'node', function () {
    var nodes = this;
    var tapped = nodes;
    var food = [];

    nodes.addClass('eater');
  
    for (; ;) {
        var connectedEdges = nodes.connectedEdges(function (el) {
            return !el.target().anySame(nodes);
        });
        
        var connectedNodes = connectedEdges.targets();
       
        Array.prototype.push.apply(food, connectedNodes);
       
        nodes = connectedNodes;

        if (nodes.empty()) { break; }
       
    }
 
    //animacion de los nodos al borrarlos
    animacion_cy_arrow_node(food,0,500,0);

    //cuando no tiene hijos verifica si en el pasado tenia y se los agrega
    if (food.length === 0) {

        //recorrer el objecto
        for (var i in object_nodes) {

            //verifica si el nodo padre tenia hijoss y si es asi lo agrega
            if (object_nodes[i] === tapped.id()) {

            cy.add({ 
                data: { id: i }
             });

            cy.style().selector('#' + i).style({
                'opacity': 0,
                'width': 10,
                'height': 10,
            });

            cy.add({ group: 'edges', data: { id: `${tapped.id()}${i}` , source: tapped.id() , target: i } })

            var layout = cy.layout({
                name: 'breadthfirst',
                directed: true,
                padding: 10
            });

            Array.prototype.push.apply(food, cy.getElementById(i));
           }
            
        }

        if (food[0] !== undefined) {
        //agrega el nodo al flujo
        layout.run();

        //animar el nodo que se agrega
        animacion_cy_arrow_node(food,0,800,1);
        }

    
    }

}); // on tap



/**
 *  @modificacion_por Cristian Duvan Machado Mosquera <cristian.machado@correounivalle.edu.co>
 *  @nuevo ahora al hace la animacion de los nodos devolverlos al grafo
 *  funcion por defecto de cytoscape hecha por @author: https://cytoscape.org/
 */
function animacion_cy_arrow_node(food,delay,duration,type) {

    let pistion_aux = {}
    let array_css = [
        {
            'width': 10,
            'height': 10,
            'border-width': 0,
            'opacity': 0
        },
        {
            'opacity': 1,
            'width': 80,
            'height': 80,
        }
    ]

    for (var i = food.length - 1; i >= 0; i--) {

        (function () {
            var thisFood = food[i];
            var eater = thisFood.connectedEdges(function (el) {
                return el.target().same(thisFood);
            }).source();

            //guardar la posicion del nodo y asignarle la del padre
            if (type === 1) {
                localStorage.setItem('position_aux',JSON.stringify(thisFood.position()))
                thisFood.position(eater.position())
                pistion_aux = JSON.parse(localStorage.getItem('position_aux'))
            }
            else {
                pistion_aux = eater.position()
            }
           
            thisFood.delay(delay, function () {
                eater.addClass('eating');
            }).animate({
                position: pistion_aux,
                css: array_css[type]
            }, {
                duration: duration,
                complete: function () {

                    if (type === 0) {
                    //guardamos el nombre del nodo borrado y quien era su padre
                    object_nodes[thisFood.id()] = eater.id();
                    thisFood.remove();
                    }
                }
            });

            delay += duration;

        })();
    } // for

}
