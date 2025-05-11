<?php
require_once '../../config.php';

$input = json_decode(file_get_contents('php://input'), true);

$continentGuesses = $input['continentGuesses'];
$areaGuesses = $input['areaGuesses'];
$areaAmount = $input['areaAmount'];
$distance = $input['distance'];

$continentScore = 4000;
$areaScore = 2000;
$geoGuessScore = 4000;

$firstPenaltyThreshold = 4;
$secondPenaltyThreshold = 10;
$thirdPenaltyThreshold = 15;
$highPenalty = 600;
$mediumPenalty = 200;
$lowPenalty = 70;
$constantPenalty = 10;

$falseContinentGuesses = $continentGuesses - 1;

if ($falseContinentGuesses > 0) {
    $highPenaltyTurns = min($falseContinentGuesses, $firstPenaltyThreshold);
    $mediumPenaltyTurns = max(0, min($falseContinentGuesses - $firstPenaltyThreshold, $secondPenaltyThreshold - $firstPenaltyThreshold));
    $lowPenaltyTurns = max(0, min($falseContinentGuesses - $secondPenaltyThreshold, $thirdPenaltyThreshold - $secondPenaltyThreshold));

    $continentScore -= $highPenaltyTurns * $highPenalty;
    $continentScore -= $mediumPenaltyTurns * $mediumPenalty;
    $continentScore -= $lowPenaltyTurns * $lowPenalty;
    
    if ($falseContinentGuesses > $thirdPenaltyThreshold) {
        $continentScore -= ($falseContinentGuesses - $thirdPenaltyThreshold) * $constantPenalty;
    }
}

$falseAreaGuesses = $areaGuesses - 1;

if ($falseAreaGuesses > 0) {
    $areaScore -= floor(($falseAreaGuesses / ($areaAmount - 1)) * 2000);
}

$geoGuessScore = floor(min(4000, $geoGuessScore * exp(-0.0035 * ($distance - 57)) - 100));

$continentScore = max(0, $continentScore);
$areaScore = max(0, $areaScore);
$geoGuessScore = max(0, $geoGuessScore);

$score = $continentScore + $areaScore + $geoGuessScore;

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

    $stmt = $mysqli->prepare("SELECT score FROM user_location_data WHERE user_id = ? AND date = ?");
    $stmt->bind_param("ss", $id, $currentDate);
    $stmt->execute();
    $stmt->bind_result($output);
    $stmt->fetch();
    $stmt->close();

    if ($output == null) {
        $update = $mysqli->prepare("UPDATE user_location_data SET score = ? WHERE user_id = ? AND date = ?");
        $update->bind_param("iss", $score, $id, $currentDate);
        $update->execute();
        $update->close();
    }   
}

echo json_encode(['score' => $score]);