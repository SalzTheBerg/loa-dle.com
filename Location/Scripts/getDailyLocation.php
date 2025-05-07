<?php
require_once '../../config.php';

$currentDate = date(format: 'Y-m-d');
$mode = 'location';

$query = "SELECT target FROM daily_targets WHERE date = '$currentDate' AND mode = '$mode'";
$result = mysqli_query(mysql: $mysqli, query: $query);

if (!$result || $result->num_rows === 0) {
    // select random image from continent then area then image -> subject to change later on to make it more "random"
    $randomContinent = $mysqli->query("SELECT id, name FROM location_continents ORDER BY RAND() LIMIT 1")->fetch_assoc();
    $randomArea = $mysqli->query("SELECT id, name FROM location_areas WHERE continent_id = {$randomContinent['id']} ORDER BY RAND() LIMIT 1")->fetch_assoc();
    $randomImage = $mysqli->query("SELECT id, name, used_coordinate_index FROM location_images WHERE area_id = {$randomArea['id']} ORDER BY RAND() LIMIT 1")->fetch_assoc();

    $imageName = $randomImage["name"];
    $randomImageId = $randomImage["id"];

    $usedCoordinateIndex = $randomImage["used_coordinate_index"];

    // and save it in daily_targets
    $stmt = $mysqli->prepare(query: "INSERT INTO daily_targets (date, mode, target) VALUES(?,?,?)");
    $stmt->bind_param("ssi", $currentDate, $mode, $randomImageId);
    $stmt->execute();

    $newIndex = ($usedCoordinateIndex + 1) % 4;
    $stmt = $mysqli->prepare("UPDATE location_images SET used_coordinate_index = ? WHERE id = ?");
    $stmt->bind_param("ii", $newIndex, $randomImageId);
    $stmt->execute();
}

$query = "SELECT target FROM daily_targets WHERE date = '$currentDate' AND mode = '$mode'";
$result = mysqli_query(mysql: $mysqli, query: $query);
$existingImageId = $result->fetch_assoc()['target'];
$query = "SELECT
    a.name AS area_name,
    c.name AS continent_name,
    i.name AS image_name,
    i.correct_x,
    i.correct_y,
    i.distance_conversion,
    lc.original_scale, 
    lc.center_x, 
    lc.center_y
    FROM location_images i
    JOIN location_areas a ON i.area_id = a.id
    JOIN location_continents c ON a.continent_id = c.id
    JOIN location_image_coordinates lc 
        ON lc.image_id = i.id AND lc.coord_index = MOD(i.used_coordinate_index - 1 + 4, 4)
    WHERE i.id = '$existingImageId'";
$result = mysqli_query(mysql: $mysqli, query: $query);
$existing = $result->fetch_assoc();

$continentName = $existing['continent_name'];
$areaName = $existing['area_name'];
$imageName = $existing['image_name'];
$correctX = $existing["correct_x"];
$correctY = $existing["correct_y"];
$distanceConversion = $existing["distance_conversion"];
$originalScale = $existing["original_scale"];
$centerX = $existing["center_x"];
$centerY = $existing["center_y"];

header(header: 'Content-Type: application/json');
echo json_encode(value: [
    "continentName" => $continentName,
    "areaName" => $areaName,
    "imageName" => $imageName,
    "correctX" => $correctX,
    "correctY"=> $correctY,
    "distanceConversion"=> $distanceConversion,
    "originalScale" => $originalScale,
    "centerX" => $centerX,
    "centerY" => $centerY
]);