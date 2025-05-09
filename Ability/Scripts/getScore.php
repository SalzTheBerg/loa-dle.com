<?php

$input = json_decode(file_get_contents('php://input'), true);

// Beispiel: Parameter auslesen
$guesses = $input['guesses'];
$nameGuessed = $input['nameGuessed'];
$withoutGrayscale = $input['withoutGrayscale'];
$withoutRotation = $input['withoutRotation'];

$score = 9000;
if ($withoutGrayscale === 0) {
    $score -= 500;
}
if ($withoutRotation === 0) {
    $score -= 200;
}

$firstPenaltyThreshold = 5;
$secondPenaltyThreshold = 10;
$highPenalty = 650;
$mediumPenalty = 350;
$lowPenalty = 150;

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
    $score += 1000;
}

$score = $score - ($guesses - $withoutGrayscale) * 100;
$score = $score - ($guesses - $withoutRotation) * 25;

echo json_encode(['score' => max(0, $score)]);