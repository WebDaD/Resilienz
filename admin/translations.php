<?php
header("Content-type: text/xml; charset=utf-8");
header("Pragma: no-cache");
header("Expires: 0");

require_once('config.php');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
if ($conn->connect_error) {
  die("Connection to Database failed: " . $conn->connect_error);
}
$sql = "SELECT s.id AS string_id, s.string_key, s.description, l.id As lang_id, l.lang_key, l.name as Language, t.translation
          FROM languages l
          JOIN strings s
          LEFT JOIN translations t ON(t.languages_id=l.id AND t.strings_id=s.id)
          ORDER BY s.string_key ASC, l.lang_key ASC;
          ";
$result = $conn->query($sql);

$translations = array();
while($row = $result->fetch_assoc()) {
  $translations[$row["string_id"]]["id"] = $row["string_id"];
  $translations[$row["string_id"]]["key"] = $row["string_key"];
  $translations[$row["string_id"]]["description"] = htmlentities($row["description"]);
  $translations[$row["string_id"]][$row["lang_key"]] = htmlentities($row["translation"]);
}
?>
<xml>
  <?php foreach($translations as $entry => $value): ?>
    <translation>
      <id><?php echo $value["id"];?></id>
      <key><?php echo $value["key"];?></key>
      <description><?php echo $value["description"];?></description>
      <deutsch><?php echo $value["de"];?></deutsch>
      <english><?php echo $value["en"];?></english>
    </translation>
<?php endforeach; ?>
</xml>