<?php
require_once '../../config.php';

$currentDate = date('Y-m-d');

$input = json_decode(file_get_contents('php://input'), true);

$score = $input['score'];

$stmt = $mysqli->prepare("SELECT COUNT(*) FROM user_ability_data WHERE date = ? AND score < ?");
$stmt->bind_param("sd",$currentDate, $score);
$stmt->execute();
$stmt->bind_result($betterThan);
$stmt->fetch();
$stmt->close();

$stmt = $mysqli->prepare("SELECT COUNT(*) FROM user_ability_data WHERE date = ?");
$stmt->bind_param("s",$currentDate);
$stmt->execute();
$stmt->bind_result($all);
$stmt->fetch();
$stmt->close();

$percentage = round(100 * (1 - $betterThan / $all));

header(header: 'Content-Type: application/json');
echo json_encode(value: [
    "percentage"=> $percentage,
    "all"=> $all
]);