
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


let object_nodes = new Object()

/**
 *  funcion por defecto de cytoscape
 */
cy.on('tap', 'node', function () {
    var nodes = this;
    var tapped = nodes;
    var food = [];
    var node_id = tapped.id();

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
 
  
    var delay = 0;
    var duration = 500;
    for (var i = food.length - 1; i >= 0; i--) {
        (function () {
            var thisFood = food[i];
            var eater = thisFood.connectedEdges(function (el) {
                return el.target().same(thisFood);
            }).source();
    
            thisFood.delay(delay, function () {
                eater.addClass('eating');
            }).animate({
                position: eater.position(),//este es el que cambia la posicion incluso en lo que lo guardo en el objeto
                css: {
                    'width': 10,
                    'height': 10,
                    'border-width': 0,
                    'opacity': 0
                }
            }, {
                duration: duration,
                complete: function () {
                    object_nodes[thisFood.id()] = node_id
                    thisFood.remove();
                }
            });

            delay += duration;
        })();
    } // for

    if (food.length === 0) {
      
        for (var i in object_nodes) {

            if (object_nodes[i] === node_id) {
            cy.add({ 
                data: { id: i }
             });
          
            cy.add({ group: 'edges', data: { source: node_id , target: i } })

            var layout = cy.layout({
                name: 'breadthfirst'
            });
            
            layout.run();
           }
            
        }
        console.log(object_nodes);
    }

}); // on tap