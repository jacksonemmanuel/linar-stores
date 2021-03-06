<?php

class Database {
    private $dbObj;

    function __construct() {
        try {
            $this->dbObj = pg_pconnect(getenv("DATABASE_URL"));
        } catch(Exception $e) {
            return $e->getMessage();
            die();
        }
    }
    function read($tableName, $id, $extra_param = "") {
        return pg_fetch_row(pg_query($this->dbObj, "SELECT * FROM $tableName WHERE $tableName" . "_Id = $id $extra_param"));
    }
    function readAll($tableName, $extra_param = "") {
        return pg_fetch_all(pg_query($this->dbObj, "SELECT * FROM $tableName $extra_param"), PGSQL_ASSOC);
    }
    function search($tableName, $column, $value, $extra_param = "") {
        $value = join(' & ', explode(' ', $value));
        return pg_fetch_all(pg_query($this->dbObj, "SELECT * FROM $tableName WHERE to_tsvector(Product_" . "$column) @@ to_tsquery('$value') $extra_param"), PGSQL_ASSOC);
    }
    function __destruct() {
        pg_close($this->dbObj);
    }
}

?>
