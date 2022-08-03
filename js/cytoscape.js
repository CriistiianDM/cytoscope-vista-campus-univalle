
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
