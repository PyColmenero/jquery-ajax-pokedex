
<?php

include("./Connection.php");
$bbdd = new BBDD();

// si están los datos de los Pokemon a añadir
if (isset($_POST["pokemonID"]) && isset($_POST["pokemonNombre"])) {
    $id = $_POST["pokemonID"];
    $nombre = $_POST["pokemonNombre"];

    selectPokemon($bbdd, $id, $nombre);
}

function selectPokemon($bbdd, $id, $nombre)
{
    // si no está repetido
    if (!pokemonRepeated($bbdd, $id)) {

        $sentencia = "INSERT INTO pokemons VALUES($id,'$nombre')";
        if (mysqli_query($bbdd->con, $sentencia)) {
            echo "<p class='goodnews mb-2'><i class='bi bi-check me-2 '></i>$nombre seleccionado correctamente. </p>";
        } else {
            echo "<p class='badnews'><i class='bi bi-x-lg me-3'></i>Error: " . mysqli_error($bbdd->con) . "</p>";
        }
    } else {
        echo "<p class='badnews'><i class='bi bi-x-lg me-3'></i>El $nombre ya está seleccionado...</p>";
    }
}

function pokemonRepeated($bbdd, $id)
{
    $sentencia = "SELECT * FROM pokemons WHERE idPokemon = $id";
    $result = $bbdd->con->query($sentencia);
    // devuelve FALSE si hay 0 repeticiones
    return mysqli_num_rows($result)!=0;
}