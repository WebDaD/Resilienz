SELECT s.id AS string_id, s.string_key, s.description, l.id As lang_id, l.lang_key, l.name as Language, t.translation
FROM languages l
JOIN strings s
LEFT JOIN translations t ON(t.languages_id=l.id AND t.strings_id=s.id)
ORDER BY s.string_key ASC, l.lang_key ASC;
