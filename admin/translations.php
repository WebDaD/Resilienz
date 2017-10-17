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
?>
<xml>
  <?php while($row = $result->fetch_assoc()): ?>
    <translation>
      <stringid><?php echo $row["string_id"];?></stringid>
      <stringkey><?php echo $row["string_key"];?></stringkey>
      <description><?php echo $row["description"];?></description>
      <langid><?php echo $row["lang_id"];?></langid>
      <langkey><?php echo $row["lang_key"];?></langkey>
      <language><?php echo $row["Language"];?></language>
      <text><?php echo htmlentities($row["translation"]);?></text>
    </translation>
  <?php endwhile; ?>
</xml>