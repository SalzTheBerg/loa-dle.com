<?php
/*require_once '../../config.php';

$json = file_get_contents("../Objects/locationSpecifications.json");
$data = json_decode($json, true);

$mysqli->query("DELETE FROM location_continents");

$mysqli->query("ALTER TABLE location_continents AUTO_INCREMENT = 1");
$mysqli->query("ALTER TABLE location_areas AUTO_INCREMENT = 1");
$mysqli->query("ALTER TABLE location_images AUTO_INCREMENT = 1");
$mysqli->query("ALTER TABLE location_image_coordinates AUTO_INCREMENT = 1");

echo "<strong>Emptied Tables and reset auto_increment.</strong><br>";

foreach ($data as $continent => $areas) {
    // Insert continent
    echo "Inserting Continent: $continent <br>";
    $stmt = $mysqli->prepare("INSERT INTO location_continents (name) VALUES (?)");
    $stmt->bind_param("s", $continent);
    $stmt->execute();
    $continent_id = $stmt->insert_id;
    $stmt->close();

    foreach ($areas as $area => $images) {
        // Insert area
        $stmt = $mysqli->prepare("INSERT INTO location_areas (continent_id, name) VALUES (?, ?)");
        $stmt->bind_param("is", $continent_id, $area);
        $stmt->execute();
        $area_id = $stmt->insert_id;
        $stmt->close();

        foreach ($images as $image_name => $info) {
            // Insert image
            $stmt = $mysqli->prepare("INSERT INTO location_images (area_id, name, correct_x, correct_y, distance_conversion, used_coordinate_index) VALUES (?, ?, ?, ?, ?, 0)");
            $stmt->bind_param("isiid", $area_id, $image_name, $info["correctX"], $info["correctY"], $info["distanceConversion"]);
            $stmt->execute();
            $image_id = $stmt->insert_id;
            $stmt->close();

            // Insert coordinates
            for ($i = 0; $i < count($info["centerX"]); $i++) {
                $stmt = $mysqli->prepare("INSERT INTO location_image_coordinates (image_id, coord_index, center_x, center_y, original_scale) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param("iiiii", $image_id, $i, $info["centerX"][$i], $info["centerY"][$i], $info["originalScale"][$i]);
                $stmt->execute();
                $stmt->close();
            }
        }
    }
}

echo "<h3>Successful.</h3>";*/
echo "<h3>Remove php comments to use this script.</h3>";