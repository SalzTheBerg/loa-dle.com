<?php
require_once '../../config.php';

$currentDate = date(format: 'Y-m-d');
$mode = 'classic';

$query = "SELECT target FROM daily_targets WHERE date = '$currentDate' AND mode = '$mode'";
$result = mysqli_query(mysql: $mysqli, query: $query);

if ($result && $result->num_rows > 0) {
    $existingCharacter = $result->fetch_assoc()['target'];
    echo json_encode(value: ["characterToGuess" => $existingCharacter]);
} else {
    // select name from characters db
    $query = "SELECT name FROM classic_characters ORDER BY RAND() LIMIT 1";
    $result = mysqli_query(mysql: $mysqli, query: $query);
    $randomCharacter = $result->fetch_assoc()['name'];

    $stmt = $mysqli->prepare(query: "INSERT INTO daily_targets (date, mode, target) VALUES(?,?,?)");
    $stmt->bind_param("sss", $currentDate, $mode, $randomCharacter);
    $stmt->execute();

    header(header: 'Content-Type: application/json');
    echo json_encode(value: ["characterToGuess" => $randomCharacter]);
}