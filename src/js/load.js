let form = {
    input_pokemonID: $("#pokemonID"),
    input_pokemonNombre: $("#pokemonNombre"),
    btn_loadJSON: $("#loadJSON"),
    btn_loadSelected: $("#btn_loadSelected"),
};

let filtros = {
    minID: 0,
    nombre: "",
    startShowingIndex: 0,
    lazyLoadStep: 100,
    getMinID() {
        this.minID = parseInt(form.input_pokemonID.val());
        if (!this.minID) this.minID = 0;
    },
    getNombre() {
        this.nombre = form.input_pokemonNombre.val();
    },
    filtrarJSON() {
        filtros.getMinID();
        filtros.getNombre();

        let JSON = allPokemons.JSON;
        if (filtros.nombre.length != 0) {
            JSON = JSON.filter(pokemon => pokemon.name.english.indexOf(filtros.nombre) != -1);
        } else if (filtros.minID != 0) {
            JSON = JSON.filter(pokemon => pokemon.id <= filtros.minID);
        }
        return JSON;
    }
};

let allPokemons = {

    table: $("#_allPokemons"),
    tbody: $("#pokemonsTbody"),
    btn_prevAll: $("#prevAll"),
    btn_nextAll: $("#nextAll"),
    JSON: null,

    length: 0,
    buildTable() {

        // borrar
        $("._filaPokemon").remove();
        // filtrar
        let JSON = filtros.filtrarJSON();

        // mostramos La tabLa
        allPokemons.table.css("display", "table");
        selectedPokemons.table.css("display", "none");

        // construir
        let html = "";
        let index = 0;
        allPokemons.length = JSON.length;
        JSON.forEach((pokemon) => {

            // muestra solo del 1 al 100, o del 200 al 300...
            if (index >= filtros.startShowingIndex && index < filtros.startShowingIndex + filtros.lazyLoadStep) {
                html += allPokemons.newRowPokemon(
                    pokemon.id,
                    pokemon.name.english,
                    pokemon.type
                );
            }
            index++;

        });
        allPokemons.tbody.prepend(html);

        // disable
        allPokemons.disableButtons();

    },
    next() {
        // si no nos pasamos de la lista
        if (filtros.startShowingIndex < allPokemons.length - filtros.lazyLoadStep) {
            filtros.startShowingIndex += filtros.lazyLoadStep;
            allPokemons.buildTable();
        }
    },
    prev() {
        // no bajamos de 0
        if (filtros.startShowingIndex != 0) {
            filtros.startShowingIndex -= filtros.lazyLoadStep;
            allPokemons.buildTable();
        }
    },
    disableButtons() {

        // si no podemos ir para atras.
        if (filtros.startShowingIndex == 0) {
            allPokemons.btn_prevAll.attr("disabled", "");
        } else {
            allPokemons.btn_prevAll.removeAttr("disabled");
        }
        // si a la siguiente nos pasamos, lo DISABLED
        if (filtros.startShowingIndex > allPokemons.length - filtros.lazyLoadStep) {
            allPokemons.btn_nextAll.attr("disabled", "");
        } else {
            allPokemons.btn_nextAll.removeAttr("disabled");
        }
    },
    loadPokemons() {
        $.getJSON("./pokedex.json", function(pokemons) {

            allPokemons.JSON = pokemons;
            allPokemons.length = pokemons.length;
            allPokemons.buildTable();

        });
    },
    seleccionarPokemon() {
        let button = $(this);
        let id = parseInt(button.data("id"));
        let nombre = button.data("nombre");

        $.ajax({
            type: "POST",
            url: "./src/php/setPokemonSeleccionado.php",
            data: { 'pokemonID': id, 'pokemonNombre': nombre },
            success: function(res) {

                info.html(res);

            },
        });
    },
    newRowPokemon(id, nombre, types) {
        let html = `<tr class="_filaPokemon">
                        <td class="position-relative">
                            <p class="_vcenter">#` + id + ` </p>
                        </td>
                        <td> 
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/` + id + `.png" height="64px" width="64px">
                            <span>` + nombre + `</span> 
                        </td>
                        <td class="position-relative">
                            <div class="_vcenter w-100">
                                <p>` + types.join(", ") + `</p>
                            </div>
                        </td>
                        <td class="position-relative">
                            <div class="_vcenter"> 
                                <button class="btn btn-success bg-success seleccionarPokemon " data-id="` + id + `" data-nombre=` + nombre + ` >Seleccionar</button> 
                            </div>
                        </td>
                    </tr>`;

        return html;
    }
}
let selectedPokemons = {
    table: $("#_selectedPokemons"),
    tbody: $("#selectedTbody"),
    btn_prevSelected: $("#prevSelected"),
    btn_nextSelected: $("#nextSelected"),
    length: 0,
    loadSelected() {


        // mostramos la tabla
        allPokemons.table.css("display", "none");
        selectedPokemons.table.css("display", "table");

        $.ajax({
            type: "POST",
            url: "./src/php/getPokemonsSeleccionados.php",
            success: function(res) {
                console.log(res);
                let pokemons = JSON.parse(res);
                let row = "";

                // borrar
                $("._filaPokemon").remove();

                // asignar LENGTH para el LAZY LOAD, que se DESABILITE el botón si te pasas
                selectedPokemons.length = pokemons.length;

                // construir
                pokemons.forEach((pokemon) => {
                    row += selectedPokemons.newRowSelectedPokemon(
                        pokemon.pokemonID,
                        pokemon.pokemonNombre,
                    );
                });
                selectedPokemons.tbody.prepend(row);

                // disable
                selectedPokemons.disableButtons();

            },
        });
    },
    borrarPokemonSeleccionado() {
        let button = $(this);
        let id = parseInt(button.data("id"));
        let nombre = button.data("nombre");

        // lanzar petición
        $.ajax({
            type: "POST",
            url: "./src/php/borrarPokemonSeleccionado.php",
            data: { 'pokemonID': id, 'pokemonNombre': nombre },
            success: function(res) {
                info.html(res);
                selectedPokemons.loadSelected();
            },
        });
    },
    next() {
        // si no nos pasamos de la lista
        if (filtros.startShowingIndex < selectedPokemons.length - filtros.lazyLoadStep) {
            filtros.startShowingIndex += filtros.lazyLoadStep;
            selectedPokemons.buildTable();
        }
    },
    prev() {
        if (filtros.startShowingIndex != 0) {
            filtros.startShowingIndex -= filtros.lazyLoadStep;
            selectedPokemons.buildTable();
        }
    },
    disableButtons() {

        // si no podemos ir para atras.
        if (filtros.startShowingIndex == 0) {
            selectedPokemons.btn_prevSelected.attr("disabled", "");
        } else {
            selectedPokemons.btn_prevSelected.removeAttr("disabled");
        }
        // si a la siguiente nos pasamos, lo DISABLED
        if (filtros.startShowingIndex > selectedPokemons.length - filtros.lazyLoadStep) {
            selectedPokemons.btn_nextSelected.attr("disabled", "");
        } else {
            selectedPokemons.btn_nextSelected.removeAttr("disabled");
        }
    },
    newRowSelectedPokemon(id, nombre) {
        let html = `<tr class="_filaPokemon">
                        <td class="position-relative">
                            <p class="_vcenter">#` + id + ` </p>
                        </td>
                        <td> 
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/` + id + `.png" height="64px" width="64px">
                            <span>` + nombre + `</span> 
                        </td>
                        <td class="position-relative">
                            <div class="_vcenter"> 
                                <button class="btn btn-success bg-danger borrarPokemon" data-id="` + id + `" data-nombre=` + nombre + ` >Borrar</button> 
                            </div>
                        </td>
                    </tr>`;

        return html;
    }
}


let info = $("#info");

$(document).ready(function() { // disable

    form.btn_loadJSON.click(function() {
        filtros.startShowingIndex = 0;
        allPokemons.buildTable();
    });
    form.btn_loadSelected.click(function() {
        filtros.startShowingIndex = 0;
        selectedPokemons.loadSelected();
    });
    allPokemons.btn_nextAll.click(allPokemons.next);
    allPokemons.btn_prevAll.click(allPokemons.prev);
    selectedPokemons.btn_nextSelected.click(selectedPokemons.next);
    selectedPokemons.btn_prevSelected.click(selectedPokemons.prev);

    // cargo solo una vez el JSON
    allPokemons.loadPokemons();

});

$(document).on("click", ".seleccionarPokemon", allPokemons.seleccionarPokemon);
$(document).on("click", ".borrarPokemon", selectedPokemons.borrarPokemonSeleccionado);
selectedPokemons.table.css("display", "none");