# Resilienz-App
Eine Webseite mit Backend-Service zur Erstellung der Bücher für das Projekt "Resilienz".
Erstellung von Druckbaren PDFs (auch ebooks?) aus Vorlagen und Bildern, in verschiedenen Sprachen.


## Steps Aktionsleiter

1. Willkommen -> Sprachauswahl (Browser-Erkennung, Cookie)
2. Neue Aktion anlegen oder Anmelden (e-Mail, pwd)
    1. Name, Ort, Datum
3. Download der Vorlagen in der passenden Sprache (anleitung: drucken, bemalen lassen)
4. Upload der Bilder für die Vorlagen (jpg, bmp, pdf, ...)
    1. Wahl der Kategorie
    2. Drehen / editieren
    3. Auswahl Layout pro Seite 
    4. Sortieren innerhalb der Kategorie (Buttons)
5. Download des PDF
6. Markieren als Fertig


## Steps Gesamtleitung
1. Anmeldung (E-Mail, Pwd)
2. Ansicht aller Aktionen
    1. Detailsansicht
    2. PDF
    3. Kontakt


## Technisches
* node.js-Anwendung mit Pug-Templates
* Angular für js
* Bildbearbeitung: http://camanjs.com/
* Propeller (bootstrap+material) als layout
    * Logo
    * Farbmuster (was grünes?)
    * Navbar designed mit Steps als NAV [Logo | 1. Aktion | 2. Vorlagen | 3. Upload | 4. Download | ()User/Logout | Flag ]
* Upload mit dropzone.
* Building Steps
* Datenbank für folgende (mysql)
    * Sprachen
    * Texte
    * User
    * Aktionen
    * Bilder
    * Layouts
* Sprachauswahl über URL
* Seitengenerierung in Linux mit imagemagcik
    * Vorlage mit Positionen
* PDF generierung mit command line tools

### paths
* GET /
    * welcome
* GEt /[:language]
    * auswahl: neue aktion oder anmelden
* GET /[:language]/[:aktion]
    * seite (navigation mittels angular-router)
* GET /[:language]/[:template]
    * unterseite, wird per # eingeladen. auch die sprache des # ist anders...
* POST /image/
    * Bilder hochladen
* GET /image/[:aktionid]/
    * Alle Bilder zur Aktion
* GET /image/[:aktionid]/[:imageid]
    * Bild
* DELETE /image/[:aktionid]/[:imageid]
    * Bild löschen
* PATCH /image/[:aktionid]/[:imageid]/turn-[right|left]
    * Bild drehen
* POST /login/
    * anmelden
* POST /aktion
    * neue Aktion anlegen
* GET /[:aktionid]
    * Aktions-Daten
* GET /[:aktionid]/book.pdf
    * PDF downloaden

### templates
* welcome + sprachauswahl
* neue aktion / anmelden
* anmelden
* vorlagen downloaden
* bilder hochladen (drehen, sortieren)
* Bild-Bearbeitung (caman.js in einem modal)
* Finalisierung (download)
* Logout

Admin
* login
* aktionsliste
* aktionsdetails (ähnlich oben)
    * bildnahaufnahme mit lightbox oder als details-seite


### datenbank
* mysql
* tabellen
    * user: id, email, password, sprach-id
    * aktionen: id, name, ort, datum, user-id, sprach-id
    * bilder: id, filename(generated), order, kategorie-id, aktions-id
    * sprachen: id, name, code
    * texte: id, key
    * sprachen-texte: sprach-id, text-id, text
    * vorlagen: id, kategorie, sprach-id

### libs
* getLangText(lang, key)
* generatePage(vorlage-id, [{pos:1, image:""}, ...])
* generateBook(aktions-id)
* turnImage(filename, direktion)

## Zeitplan
* backend: 16 Stunden
* ui-design: 4 Stunden
* ui-code: 8 Stunden
* Testing: 8 Stunden