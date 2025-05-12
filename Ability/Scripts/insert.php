<?php
/*require_once '../../config.php';

$json = file_get_contents("../Objects/abilityList.json");
$data = json_decode($json, true);

$mysqli->query("DELETE FROM ability_skills");
$mysqli->query("DELETE FROM ability_classes");

$mysqli->query("ALTER TABLE ability_classes AUTO_INCREMENT = 1");
$mysqli->query("ALTER TABLE ability_skills AUTO_INCREMENT = 1");

echo "<strong>Emptied Tables and reset auto_increment.</strong><br>";

foreach ($data as $className => $classInfo) {
    echo "Inserting Class: $className<br>";

    // Insert Class
    $stmt = $mysqli->prepare("INSERT INTO ability_classes (name) VALUES (?)");
    $stmt->bind_param("s", $className);
    $stmt->execute();
    $class_id = $stmt->insert_id;
    $stmt->close();

    // Insert Skill
    foreach ($classInfo["abilities"] as $skillName) {
        $stmt = $mysqli->prepare("INSERT INTO ability_skills (class_id, name) VALUES (?, ?)");
        $stmt->bind_param("is", $class_id, $skillName);
        $stmt->execute();
        $stmt->close();
    }
}

echo "<h3>Successful.</h3>";*/
echo "<h3>Remove php comments to use this script.</h3>";