<?php
require_once '../../config.php';

$input = json_decode(file_get_contents('php://input'), true);

$guessX = $input['guessX'];
$guessY = $input['guessY'];

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

    $stmt = $mysqli->prepare("SELECT guess_x, guess_y FROM user_location_data WHERE user_id = ? AND date = ?");
    $stmt->bind_param("ss", $id, $currentDate);
    $stmt->execute();
    $stmt->bind_result($x, $y);
    $stmt->fetch();
    $stmt->close();
    
    if ($x === null && $y === null) {
        $stmt = $mysqli->prepare("UPDATE user_location_data SET guess_x = ?, guess_y = ? WHERE user_id = ? AND date = ?");
        $stmt->bind_param("ddss", $guessX, $guessY, $id, $currentDate);
        $stmt->execute();
        $stmt->close();
    }
}