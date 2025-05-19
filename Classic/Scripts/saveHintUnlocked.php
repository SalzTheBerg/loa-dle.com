<?php
require_once '../../config.php';

$input = json_decode(file_get_contents('php://input'), true);

$hintUnlocked = $input['hintUnlocked'];

if ($hintUnlocked) {
    $hintUnlocked = 1;
} 

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
}

$stmt = $mysqli->prepare("UPDATE user_classic_data SET hint_unlocked = ? WHERE user_id = ? AND date = ?");
$stmt->bind_param("iss", $hintUnlocked, $id, $currentDate);
$stmt->execute();
$stmt->close();