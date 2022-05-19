
<?php

include("./Connection.php");
$bbdd = new BBDD();

$sentencia = "SELECT * FROM pokemons";

// si hay error
if (!$result = $bbdd->con->query($sentencia)) {
    echo "<p class='badnews'><i class='bi bi-x-lg me-3'></i>Error: " . mysqli_error($bbdd->con) . "</p>";
    exit;
}

// generar ARRAY
$pokemons = array();
while ($row = $result->fetch_assoc()) {
    array_push($pokemons, array(
        "pokemonID"     => $row["idPokemon"],
        "pokemonNombre" => $row["nombrePokemon"],
    ));
}

// cerrar conexion
$bbdd->con->close();

// devolverlo
echo json_encode($pokemons);
