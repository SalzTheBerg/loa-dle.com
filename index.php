<?php
require_once 'config.php';

$cookieName = "loa_user_id";

if (!isset($_COOKIE[$cookieName])) {
    do {
        $randomId = bin2hex(random_bytes(8));
        $stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE user_id = ?");
        $stmt->bind_param("s", $randomId);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();
    } while ($count > 0);

    $insert = $mysqli->prepare("INSERT INTO users (user_id) VALUES (?)");
    $insert->bind_param("s", $randomId);
    $insert->execute();
    $insert->close();

} else {
    $randomId = $_COOKIE[$cookieName];
}
$expiry = time() + (365 * 24 * 60 * 60);
setcookie($cookieName, $randomId, $expiry, "/");
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>LoAdle</title>
        <link rel="stylesheet" href="style.css">
        <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet">
    </head>
    <body>
        <img src="./Backgrounds/logo.png" alt="Logo of the loa-dle (lostarkdle) minigame website." style="width: 500px; padding: 50px;">

        <a class="link" href="Classic/classic.html">
            <div>
                <h2>Classic</h2>
                <hr class="underline">
                <p>Guess the character</p>
            </div>
        </a>
        
        <a class="link" href="Ability/ability.html">
            <div>
                <h2>Ability</h2>
                <hr class="underline">
                <p>Which class has this ability?</p>
            </div>
        </a>

        <a class="link" href="Location/location.html">
            <div>
                <h2>Location</h2>
                <hr class="underline">
                <p>Where was the image taken?</p>
            </div>
        </a>

        <div id="footer">
            <img id="info" class="icon" src="info.webp" width="32px"  height="32px">
        </div>

        <div id="notice" class="infoDiv" style="display: none;">
            <h2 style="margin-top: 0;">Early Access Notice</h2>
            <p>This site is still in early access and actively being developed.<br>
                You may encounter bugs or unfinished features.<br>
                Visuals and gameplay elements will continue to improve with future updates.<br>
                Thanks for your patience and feedback!
            </p>
            <button class="confirmButton" onclick="closeNotice()">Go !</button>
        </div>
       
        <footer style="max-width: 300px font-size: 14px; display: flex; flex-direction: column;">
            <a href="./index.php">loa-dle.com</a>
            <a id="privacyPolicy">Privacy Policy</a>
            <a href="./impressumNotice.html">Impressum (nach § 5 TMG)</a>
        </footer>

        <script src="about.js"></script>
        <script src="notice.js"></script>
        <script src="privacyPolicy.js"></script>
    </body>
</html>