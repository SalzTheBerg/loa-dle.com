<?php
require_once '../../config.php';

$currentDate = date(format: 'Y-m-d');
$mode = 'location';

$query = "SELECT target FROM daily_targets WHERE date = '$currentDate' AND mode = '$mode'";
$result = mysqli_query(mysql: $mysqli, query: $query);

if ($result && $result->num_rows > 0) {
    $existingImageId = $result->fetch_assoc()['target'];
    $query = "SELECT a.name AS area_name, c.name AS continent_name, correct_x, correct_y, distance_conversion from location_images i JOIN location_areas a ON i.area_id = a.id JOIN location_continents c ON a.continent_id = c.id WHERE i.id = '$existingImageId'";
    $result = mysqli_query(mysql: $mysqli, query: $query);
    $existing = $result->fetch_assoc();
    $continentName = $existing['continent_name'];
    $areaName = $existing['area_name'];
    $correctX = $existing["correct_x"];
    $correctY = $existing["correct_y"];
    $distanceConversion = $existing["distance_conversion"];

    header(header: 'Content-Type: application/json');
    echo json_encode(value: [
        "continentName" => $continentName,
        "areaName" => $areaName,
        "correctX" => $correctX,
        "correctY"=> $correctY,
        "distanceConversion"=> $distanceConversion
    ]);
} else {
    // select continent from db
    $query = "SELECT id, name FROM location_continents ORDER BY RAND() LIMIT 1";
    $result = mysqli_query(mysql: $mysqli, query: $query);
    $randomContinent = $result->fetch_assoc();
    $continentName = $randomContinent['name'];
    $randomContinentId = $randomContinent['id'];

    // select rand area from db
    $query = "SELECT id, name FROM location_areas where continent_id = $randomContinentId ORDER BY RAND() LIMIT 1";
    $result = mysqli_query(mysql: $mysqli, query: $query);
    $randomArea = $result->fetch_assoc();
    $areaName = $randomArea["name"];
    $randomAreaId = $randomArea["id"];

    // select rand image from db
    $query = "SELECT id, name, correct_x, correct_y, distance_conversion, used_coordinate_index FROM location_images where area_id = $randomAreaId ORDER BY RAND() LIMIT 1";
    $result = mysqli_query(mysql: $mysqli, query: $query);
    $randomImage = $result->fetch_assoc();
    $imageName = $randomImage["name"];
    $randomImageId = $randomImage["id"];
    $correctX = $randomImage["correct_x"];
    $correctY = $randomImage["correct_y"];
    $distanceConversion = $randomImage["distance_conversion"];
    $usedCoordinateIndex = $randomImage["used_coordinate_index"];

    // and save it in daily_targets
    $stmt = $mysqli->prepare(query: "INSERT INTO daily_targets (date, mode, target) VALUES(?,?,?)");
    $stmt->bind_param("ssi", $currentDate, $mode, $randomImageId);
    $stmt->execute();

    // get the correct zoom depending on usedCoordinateIndex and increment it
    $query = "SELECT center_x, center_y, original_scale FROM location_image_coordinates where image_id = $randomImageId AND coord_index = $usedCoordinateIndex";
    $result = mysqli_query(mysql: $mysqli, query: $query);
    $imageSpecifications = $result->fetch_assoc();
    $centerX = $imageSpecifications["center_x"];
    $centerY = $imageSpecifications["center_y"];
    $originalScale = $imageSpecifications["original_scale"];

    $newIndex = ($usedCoordinateIndex + 1) % 4;
    $stmt = $mysqli->prepare("UPDATE location_images SET used_coordinate_index = ? WHERE id = ?");
    $stmt->bind_param("ii", $newIndex, $randomImageId);
    $stmt->execute();

    header(header: 'Content-Type: application/json');
    echo json_encode(value: [
        "continentName" => $continentName,
        "areaName" => $areaName,
        "correctX" => $correctX,
        "correctY"=> $correctY,
        "distanceConversion"=> $distanceConversion
    ]);
}