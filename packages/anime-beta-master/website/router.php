<?php

$requestedAbsoluteFile = dirname(__FILE__) . $_SERVER['REQUEST_URI'];

// if requested file isnt an html file
if (!preg_match('/\.html$/', $requestedAbsoluteFile)) {
  return false;
}

// if request is a directory call check if index files exist
if (is_dir($requestedAbsoluteFile)) {
  $indexFile = $requestedAbsoluteFile . '/index.html';
  if (is_file($indexFile)) {
    $requestedAbsoluteFile = $indexFile;
  }
}

// if requested file does not exist or is directory => 404
if (!is_file($requestedAbsoluteFile)) {
  header($_SERVER['SERVER_PROTOCOL'].' 404 Not Found');
  require __DIR__ . '/404.html';
  return true;
}
