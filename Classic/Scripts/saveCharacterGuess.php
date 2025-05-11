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

    // Check if daily row exists
    $stmt = $mysqli->prepare("SELECT COUNT(*) FROM user_classic_data WHERE user_id = ? AND date = ?");
    $stmt->bind_param("ss", $id,$currentDate);
    $stmt->execute();

    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();

    if ($count == 0) {
        // Create one for user if not and insert guess
        // make guess an array
        $guess = [$guess];
        $jsonGuess = json_encode($guess);

        $stmt = $mysqli->prepare("INSERT INTO user_classic_data (user_id, date, guessed_characters) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $id, $currentDate, $jsonGuess);
        $stmt->execute();
        $stmt->close();

    } else {
        $stmt = $mysqli->prepare("SELECT guessed_characters FROM user_classic_data WHERE user_id = ? AND date = ?");
        $stmt->bind_param("ss", $id, $currentDate);
        $stmt->execute();
        $stmt->bind_result($output);
        $stmt->fetch();
        $stmt->close();

        $existingGuesses = json_decode($output, true);

        if (!in_array($guess, $existingGuesses)) {
            $existingGuesses[] = $guess;
            $updatedJson = json_encode($existingGuesses);

            $update = $mysqli->prepare("UPDATE user_classic_data SET guessed_characters = ? WHERE user_id = ? AND date = ?");
            $update->bind_param("sss", $updatedJson, $id, $currentDate);
            $update->execute();
            $update->close();
        }
    }
}