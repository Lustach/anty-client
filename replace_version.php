<?php
file_put_contents(
  'package.json',
  preg_replace('/version\": \"[0-9\.]+-*(alpha)*(beta)*/', 'version": "1000.01.01-alpha', file_get_contents('package.json'))
);