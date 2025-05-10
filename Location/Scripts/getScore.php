<?php

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
echo json_encode(['score' => min(10000, $score)]);