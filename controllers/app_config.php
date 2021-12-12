<?php

class Database {
    private $dbObj;

    function __construct() {
        try {
            $db = parse_url(getenv("DATABASE_URL"));

            $dbObj = new PDO("pgsql:" . sprintf(
                "host=%s;port=%s;user=%s;password=%s;dbname=%s",
                $db["host"],
                $db["port"],
                $db["user"],
                $db["pass"],
                ltrim($db["path"], "/")
            ));
        } catch(PDOException $e) {
            return $e->getMessage();
            die();
        }
    }
    function read($tableName, $id, $extra_param = "") {
        return pg_fetch(pg_query($this->dbObj, "SELECT * FROM $tableName WHERE $tableName" . "_Id = $id $extra_param"));
    }
    function readAll($tableName, $extra_param = "") {
        return pg_fetch_all(pg_query($this->dbObj, "SELECT * FROM $tableName $extra_param"), PGSQL_ASSOC);
    }
    function search($tableName, $column, $value, $extra_param = "") {
        return pg_fetch_all(pg_query($this->dbObj, "SELECT * FROM $tableName WEHRE to_tsvector($column) @@ to_tsquery($value) $extra_param"), PGSQL_ASSOC);
    }
    function __destruct() {
        pg_close($this->dbObj);
    }
}

?>
