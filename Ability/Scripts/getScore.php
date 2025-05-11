<?php
require_once '../../config.php';

$input = json_decode(file_get_contents('php://input'), true);

$guesses = $input['guesses'];
$nameGuessed = $input['nameGuessed'];
$withoutGrayscale = $input['withoutGrayscale'];
$withoutRotation = $input['withoutRotation'];

$score = 8000;
if ($withoutGrayscale === 0) {
    $score -= 500;
}
if ($withoutRotation === 0) {
    $score -= 200;
}

$firstPenaltyThreshold = 5;
$secondPenaltyThreshold = 10;
$highPenalty = 750;
$mediumPenalty = 450;
$lowPenalty = 250;

$falseGuesses = $guesses - 1;

if ($falseGuesses > 0) {
    $highPenaltyTurns = min($falseGuesses, $firstPenaltyThreshold);
    $mediumPenaltyTurns = max(0, min($falseGuesses - $firstPenaltyThreshold, $secondPenaltyThreshold - $firstPenaltyThreshold));
    $lowPenaltyTurns = max(0, $falseGuesses - $secondPenaltyThreshold);

    $score -= $highPenaltyTurns * $highPenalty;
    $score -= $mediumPenaltyTurns * $mediumPenalty;
    $score -= $lowPenaltyTurns * $lowPenalty;
}

if ($nameGuessed) {
    $score += 2000;
}

$score -= ($guesses - $withoutGrayscale) * 100;
$score -= ($guesses - $withoutRotation) * 25;

$score = min(10000, max(0, $score));

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

    $stmt = $mysqli->prepare("SELECT score FROM user_ability_data WHERE user_id = ? AND date = ?");
    $stmt->bind_param("ss", $id, $currentDate);
    $stmt->execute();
    $stmt->bind_result($output);
    $stmt->fetch();
    $stmt->close();

    if ($output == null) {
        $update = $mysqli->prepare("UPDATE user_ability_data SET score = ? WHERE user_id = ? AND date = ?");
        $update->bind_param("iss", $score, $id, $currentDate);
        $update->execute();
        $update->close();
    }   
}

echo json_encode(['score' => $score]);