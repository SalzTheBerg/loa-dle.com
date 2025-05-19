<?php
require_once '../../config.php';

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

    $stmt = $mysqli->prepare("SELECT score, guessed_characters, hint_unlocked FROM user_classic_data WHERE user_id = ? AND date = ?");
    $stmt->bind_param("ss", $id, $currentDate);
    $stmt->execute();
    $stmt->bind_result($score, $guessedCharacters, $hintUnlocked);
    $stmt->fetch();
    $stmt->close();

    header(header: 'Content-Type: application/json');
    echo json_encode(value: [
        "score" => $score,
        "guessedCharacters" => $guessedCharacters,
        "hintUnlocked"=> $hintUnlocked
    ]);
}