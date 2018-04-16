<?php require 'config.php'; ?>
<html>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta charset="UTF-8"/>
    <meta name="application-name" content="Resilienz :: Admin"/>
    <meta name="author" content="WebDaD"/>
    <meta name="publisher" content="Dr. Maya Götz"/>
    <meta name="copyright" content="Dr. Maya Götz"/>
    <meta name="description" content="Website to manage book creation"/>
    <meta name="page-topic" content="Forschung Technik"/>
    <meta name="page-type" content="HTML-Formular"/>
    <meta name="audience" content="All"/>
    <meta http-equiv="content-language" content="en"/>
    <meta name="robots" content="index, follow"/>
    <meta name="DC.Creator" content="WebDaD"/>
    <meta name="DC.Publisher" content="Dr. Maya Götz"/>
    <meta name="DC.Rights" content="Dr. Maya Götz"/>
    <meta name="DC.Description" content="Reslienz - An App of the storytelling club"/>
    <meta name="DC.Language" content="en"/>
    <meta property="og:type" content="website"/>
    <meta property="og:title" content="Resilienz"/>
    <meta property="og:description" content="Reslienz - An App of the storytelling club"/>
    <meta property="og:url" content="http://storytellingclub.de"/>
    <meta property="og:image" content="http://storytellingclub.de/images/apple-touch-icon.png"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:site" content="http://storytellingclub.de"/>
    <meta name="twitter:title" content="Reslienz"/>
    <meta name="twitter:description" content="Reslienz - An App of the storytelling club."/>
    <meta name="twitter:image" content="http://storytellingclub.de/images/apple-touch-icon.png"/>
    <link rel="stylesheet" href="bootstrap.min.css"/>
    <link rel="stylesheet" href="bootstrap-sortable.css"/>
    <link rel="stylesheet" href="font-awesome.min.css"/>
    <meta name="theme-color" content="#008ae1"/>
    <title>Resilienz :: Admin</title>
    <?php
      $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
      if ($conn->connect_error) {
        die("Connection to Database failed: " . $conn->connect_error);
      }
      $sql = "SELECT u.email, u.language, u.action_id, a.finalized, a.book, a.active, a.last_change, a.comment FROM `userList` u, actionList a WHERE u.id = a.user_id";
      $result = $conn->query($sql);
      $results = array();
      $results_count = 0;
      if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
          if (isset($results[$row->email]) && $results[$row->email]->action_id == $row->action_id) {
            print_r($row);
            echo $row["email"]."<hr/>";
            // object exists in array; do nothing
          } else {
            $results_count++;
            $results[$row["email"]] = $row;
          }
        }
      }
      $conn->close();
    ?>
    <style>
      @media only screen and (max-width: 800px) {
        /* Force table to not be like tables anymore */
        #no-more-tables table, 
        #no-more-tables thead, 
        #no-more-tables tbody, 
        #no-more-tables th, 
        #no-more-tables td, 
        #no-more-tables tr { 
          display: block; 
        }
      
        /* Hide table headers (but not display: none;, for accessibility) */
        #no-more-tables thead tr { 
          position: absolute;
          top: -9999px;
          left: -9999px;
        }
      
        #no-more-tables tr { border: 1px solid #ccc; }
      
        #no-more-tables td { 
          /* Behave  like a "row" */
          border: none;
          border-bottom: 1px solid #eee; 
          position: relative;
          padding-left: 50%; 
          white-space: normal;
          text-align:left;
        }
      
        #no-more-tables td:before { 
          /* Now like a table header */
          position: absolute;
          /* Top/left values mimic padding */
          top: 6px;
          left: 6px;
          width: 45%; 
          padding-right: 10px; 
          white-space: nowrap;
          text-align:left;
          font-weight: bold;
        }
      
        /*
        Label the data
        */
        #no-more-tables td:before { content: attr(data-title); }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>STC :: <?php echo $results_count;?> Books</h1>
      <?php if ($results_count > 0):?>
      <div id="no-more-tables">
        <table class="table table-bordered table-condensed table-striped table-hover sortable">
          <thead>
            <tr>
              <th data-defaultsort="desc">User - E-Mail</th>
              <th>Language</th>
              <th>Comment</th>
              <th>Last Change</th>
              <th>Active</th>
              <th>Book</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($results as &$row): ?>
              <tr>
                <td data-title="User - E-Mail"><?php echo $row["email"];?></td>
                <td data-title="Language"><?php echo $row["language"];?></td>
                <td data-title="Comment"><?php echo $row["comment"];?></td>
                <td data-title="Last Change"><?php echo $row["last_change"];?></td>
                <td data-title="Active" data-value="<?php echo $row["active"];?>">
                <?php if($row["active"] == "1") : ?>
                    <i class="fa fa-check" aria-hidden="true" style="color:green;"></i>
                  <?php else: ?>
                    &nbsp;
                  <?php endif; ?>
                </td>
                <td data-value="<?php echo $row["book"];?>" data-title="Book">
                  <?php if($row["book"] == "Y" || $row["book"] == "O") : ?>
                    <a href="https://storytellingclub.de/admin/book/<?php echo $row["action_id"];?>" target="_blank"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Download</a>
                  <?php else: ?>
                      &nbsp;
                  <?php endif; ?>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    <?php else: ?>
      <p class="well">No Entries yet</p>
    <?php endif; ?>
    </div>
    <script src="jquery.min.js"></script>
    <script src="bootstrap.min.js"></script>
    <script src="bootstrap-sortable.js"></script>
  </body>
</html>