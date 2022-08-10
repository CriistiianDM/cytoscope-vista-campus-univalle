
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
async function jerarquia_cytoscape() {


    //obtener los nodos del grafo
    const nodes_praticantes = await elements_array('node_praticantes')
    const nodes_monitor = await elements_array('node_monitores')
    const nodes_estudiante = await elements_array('node_student')

    //obtener los edges del grafo
    const edges_praticantes = await elements_array('edges_node_pp')
    const edges_monitor = await elements_array('edges_node_pm')
    const edges_estudiante = await elements_array('edges_node_me')

    //agregar los nodos al grafo
    map_nodes(nodes_praticantes, 'praticante', 0)
    map_nodes(nodes_monitor, 'monitor', 0)
    map_nodes(nodes_estudiante, 'Nombre(s),Apellido(s)', 1)

    //agregar los edges al grafo
    map_edges(edges_praticantes, 'profecional,praticante', 0)
    map_edges(edges_monitor, 'praticante,monitor', 0)
    map_edges(edges_estudiante, 'monitor,nombres,apellidos', 1)


    var layout = cy.layout({
        name: 'breadthfirst',
        directed: true,
        padding: 10
    });

    //guaradar la posicion del grafo y el zoom del grafo
    localStorage.setItem('pan', JSON.stringify(cy.pan()))
    localStorage.setItem('zoom', JSON.stringify(cy.zoom()))

    //agrega el nodo al flujo
    layout.run();

    //evitar efecto de movimiento del grafo
    cy.pan(JSON.parse(localStorage.getItem('pan')))
    cy.zoom(JSON.parse(localStorage.getItem('zoom')))

    /* Simulacion de  animacion de un nodo predeterminado */

    //variables
    var nodes = cy.getElementById('Martha Lucia');
    var food = [];

    //edges del nodo seleccionado
    get_nodes_edges(food,nodes)

    //animacion de los nodos al borrarlos
    animacion_cy_arrow_node(food, 0, 0, 0);

}

//llamado de la funcion jerarquia_cytoscape
jerarquia_cytoscape()


/**
 * @autor Cristian Duvan Machado Mosquera <cristian.machado@correounivalle.edu.co>
 * @des  map para obtener los nodos
 * @param nodes_praticantes array de nodos
 * @param type tipo de nodo
 * @param index indice del nodo
*/
async function map_nodes(node_json, type, index) {

    //recorrer los nodos del grafo con map
    node_json.map(function (node) {

        let id_node = (index === 0) ? node[type] : node[(type).split(',')[0]] + node[(type).split(',')[1]]

        cy.add({
            data: { id: id_node }
        });

    })

}



/**
 * @autor Cristian Duvan Machado Mosquera <cristian.machado@correounivalle.edu.co>
 * @des map para obtener los edges
 * @param edges_json array de edges
 * @param type tipo de edge
 * @param index indice del edge
*/
async function map_edges(edges_json, type, index) {

    //recorrer los edges del grafo con map
    edges_json.map(function (edge) {

        if (index === 0) {
            cy.add({
                data: { source: edge[(type).split(',')[0]], target: edge[(type).split(',')[1]] }
            });
        } else {
            cy.add({
                data: { source: edge[(type).split(',')[0]], target: edge[(type).split(',')[1]]+edge[(type).split(',')[2]] }
            });
        }

    }
    )

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
    
    //obtener los nodos y sus relaciones 
    get_nodes_edges(food,nodes)
    
    //animacion de los nodos al borrarlos
    animacion_cy_arrow_node(food, 0, 500, 0);

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

                cy.add({ group: 'edges', data: { id: `${tapped.id()}${i}`, source: tapped.id(), target: i } })

                var layout = cy.layout({
                    name: 'breadthfirst',
                    directed: true,
                    padding: 10
                });

                Array.prototype.push.apply(food, cy.getElementById(i));
            }

        }

        if (food[0] !== undefined) {

            //guardar la posicion del nodo
            localStorage.setItem('pan', JSON.stringify(cy.pan()))
            localStorage.setItem('zoom', JSON.stringify(cy.zoom()))

            //agrega el nodo al flujo
            layout.run();

            //evitar efecto de movimiento del grafo
            cy.pan(JSON.parse(localStorage.getItem('pan')))
            cy.zoom(JSON.parse(localStorage.getItem('zoom')))

            //animar el nodo que se agrega
            animacion_cy_arrow_node(food, 0, 800, 1);
        }


    }

}); // on tap



/**
 *  @modificacion_por Cristian Duvan Machado Mosquera <cristian.machado@correounivalle.edu.co>
 *  @nuevo ahora al hace la animacion de los nodos devolverlos al grafo
 *  funcion por defecto de cytoscape hecha por @author: https://cytoscape.org/
 */
function animacion_cy_arrow_node(food, delay, duration, type) {

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
                localStorage.setItem('position_aux', JSON.stringify(thisFood.position()))
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


/**
 *  @des funcion para obtener los nodos y sus relaciones 
 *  funcion por defecto de cytoscape hecha por @author: https://cytoscape.org/
*/
function get_nodes_edges(food,nodes) {

    for (; ;) {
        var connectedEdges = nodes.connectedEdges(function (el) {
            return !el.target().anySame(nodes);
        });

        var connectedNodes = connectedEdges.targets();

        Array.prototype.push.apply(food, connectedNodes);

        nodes = connectedNodes;

        if (nodes.empty()) { break; }

    }

}