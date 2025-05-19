<?php
require_once '../../config.php';

$currentDate = date(format: 'Y-m-d');
$mode = 'ability';

$query = "SELECT target FROM daily_targets WHERE date = '$currentDate' AND mode = '$mode'";
$result = mysqli_query(mysql: $mysqli, query: $query);

if ($result && $result->num_rows > 0) {
    $existingSkillId = $result->fetch_assoc()['target'];
    $query = "SELECT s.name AS skill_name, c.name AS class_name from ability_skills s JOIN ability_classes c ON s.class_id = c.id WHERE s.id = '$existingSkillId'";
    $result = mysqli_query(mysql: $mysqli, query: $query);
    $existing = $result->fetch_assoc();
    $existingClassName = $existing['class_name'];
    $existingSkillName = $existing['skill_name'];

    echo json_encode(value: [
        "className" => $existingClassName,
        "skillName" => $existingSkillName
    ]);
} else {
    // select rand class from db
    $query = "SELECT ac.id, ac.name
                FROM ability_classes ac
                WHERE ac.id NOT IN (
                    SELECT class_id FROM (
                        SELECT DISTINCT s.class_id
                        FROM daily_targets t
                        JOIN ability_skills s ON t.target = s.id
                        WHERE t.mode = 'ability'
                        ORDER BY t.date DESC
                        LIMIT 2
                    ) AS recent_classes
                )
                ORDER BY RAND()
                LIMIT 1";
    $result = mysqli_query(mysql: $mysqli, query: $query);
    $randomClass = $result->fetch_assoc();
    $className = $randomClass['name'];
    $randomClassId = $randomClass['id'];

    // select rand skill from db
    $query = "SELECT id, name
                FROM ability_skills
                WHERE class_id = $randomClassId
                AND id NOT IN (
                    SELECT target FROM (
                    SELECT target
                    FROM daily_targets
                    WHERE mode = 'ability'
                    ORDER BY date DESC
                    LIMIT 50
                    ) AS recent_targets
                )
                ORDER BY RAND()
                LIMIT 1";
    $result = mysqli_query(mysql: $mysqli, query: $query);
    $randomSkill = $result->fetch_assoc();
    $skillName = $randomSkill["name"];
    $randomSkillId = $randomSkill["id"];

    // and save it in daily_targets
    $stmt = $mysqli->prepare(query: "INSERT INTO daily_targets (date, mode, target) VALUES(?,?,?)");
    $stmt->bind_param("ssi", $currentDate, $mode, $randomSkillId);
    $stmt->execute();

    header(header: 'Content-Type: application/json');
    echo json_encode(value: [
        "className" => $className,
        "skillName" => $skillName
    ]);
}