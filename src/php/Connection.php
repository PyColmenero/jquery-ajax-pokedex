<?php

class BBDD
{
    public $database_user = 'studium';
    public $database_pasw = 'studium__';
    public $database_nombre = 'studium_dwc_p3';
    public $database_port = '3306';
    public $IP = 'localhost';
    public $con = null;

    public function __construct()
    {
        $this->con = mysqli_init();
        mysqli_real_connect($this->con, $this->IP, $this->database_user, $this->database_pasw, $this->database_nombre, $this->database_port);
        $this->con->set_charset("utf8");
    }

}