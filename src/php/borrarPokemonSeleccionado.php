
<?php

include("./Connection.php");
$bbdd = new BBDD();

// si están los datos de los Pokemon a borrar
if (isset($_POST["pokemonID"]) && isset($_POST["pokemonNombre"])) {
    $id = $_POST["pokemonID"];
    $nombre = $_POST["pokemonNombre"];

    borrarPokemon($bbdd, $id, $nombre);
}

function borrarPokemon($bbdd, $id, $nombre)
{
    $sentencia = "DELETE FROM pokemons WHERE idPokemon = $id";
    if (mysqli_query($bbdd->con, $sentencia)) {
        echo "<p class='goodnews mb-2'><i class='bi bi-check me-2 '></i>$nombre borrado correctamente. </p>";
    } else {
        echo "<p class='badnews'><i class='bi bi-x-lg me-3'></i>Error: " . mysqli_error($bbdd->con) . "</p>";
    }

    $bbdd->con->close();
}
