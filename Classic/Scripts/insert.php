<?php
require_once '../../config.php';

$json = file_get_contents("../Objects/characterList.json");
$data = json_decode($json, true);

$mysqli->query("DELETE FROM classic_characters");

$mysqli->query("ALTER TABLE classic_characters AUTO_INCREMENT = 1");

echo "<strong>Emptied Table and reset auto_increment.</strong><br>";

// Hilfsfunktion zum sicheren JSON-Feldzugriff
function joinOrNull($value) {
    return is_array($value) ? json_encode($value) : $value;
}

foreach ($data as $name => $info) {
    echo "Inserting Character: $name<br>";

    $gender = $info["Gender"] ?? null;
    $race = joinOrNull($info["Race"] ?? null);
    $first = $info["First Appearance"] ?? null;
    $affinity = joinOrNull($info["Affinity"] ?? null);
    $rarity = joinOrNull($info["Card Rarity"] ?? null);
    $height = joinOrNull($info["Height"] ?? null);
    $status = joinOrNull($info["Status"] ?? null);
    $continent = $info["Continent"] ?? null;

    $stmt = $mysqli->prepare("
        INSERT INTO classic_characters 
        (name, gender, race, first_appearance, affinity, card_rarity, height, status, continent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("sssssssss", $name, $gender, $race, $first, $affinity, $rarity, $height, $status, $continent);
    $stmt->execute();
    $stmt->close();
}

echo "<h3>Successful.</h3>";