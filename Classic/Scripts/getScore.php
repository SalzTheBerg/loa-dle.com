<?php

$input = json_decode(file_get_contents('php://input'), true);

$guesses = $input['guesses'];
$correctAttributes = $input['correctAttributes'];

$score = 10000;

$firstPenaltyThreshold = 5;
$secondPenaltyThreshold = 10;
$highPenalty = 1350;
$mediumPenalty = 750;
$lowPenalty = 350;

$falseGuesses = max(0, $guesses - 2);

if ($falseGuesses > 0) {
    $highPenaltyTurns = min($falseGuesses, $firstPenaltyThreshold);
    $mediumPenaltyTurns = max(0, min($falseGuesses - $firstPenaltyThreshold, $secondPenaltyThreshold - $firstPenaltyThreshold));
    $lowPenaltyTurns = max(0, $falseGuesses - $secondPenaltyThreshold);

    $score -= $highPenaltyTurns * $highPenalty;
    $score -= $mediumPenaltyTurns * $mediumPenalty;
    $score -= $lowPenaltyTurns * $lowPenalty;
}

$score += $correctAttributes * 20;

echo json_encode(['score' => min(10000, max(0, $score))]);