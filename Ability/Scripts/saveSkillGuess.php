<?php
require_once '../../config.php';

$input = json_decode(file_get_contents('php://input'), true);

$guess = $input['guess'];

$cookieName = "loa_user_id";
$currentDate = date('Y-m-d');

if (isset($_COOKIE[$cookieName])) {
    $randomId = $_COOKIE[$cookieName];

    // Get user id from cookie Id
    $stmt = $mysqli->prepare("SELECT id FROM users WHERE user_id = ?");
    $stmt->bind_param("s", $randomId);
    $stmt->execute();

    $stmt->bind_result($id);
    $stmt->fetch();
    $stmt->close();

    $stmt = $mysqli->prepare("SELECT guessed_skill FROM user_ability_data WHERE user_id = ? AND date = ?");
    $stmt->bind_param("ss", $id, $currentDate);
    $stmt->execute();
    $stmt->bind_result($output);
    $stmt->fetch();
    $stmt->close();


    if ($output === null) {
        $update = $mysqli->prepare("UPDATE user_ability_data SET guessed_skill = ? WHERE user_id = ? AND date = ?");
        $update->bind_param("sss", $guess, $id, $currentDate);
        $update->execute();
        $update->close();
    } 
}