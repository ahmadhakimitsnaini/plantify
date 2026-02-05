<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

function readSliderData()
{
  return json_decode(file_get_contents('dataslider.json') ?: '{}', true);
}

function writeSliderData($data)
{
  file_put_contents('dataslider.json', json_encode($data, JSON_PRETTY_PRINT));
}

// Handle GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $sliderData = readSliderData();
  echo json_encode($sliderData ?: ['message' => 'Data not found']);
  exit;
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $incomingData = json_decode(file_get_contents('php://input'), true);

  if ($incomingData) {
    $sliderData = readSliderData(); // Load current data
    $sliderData = array_merge($sliderData, $incomingData); // Merge with new data
    writeSliderData($sliderData); // Save updated data
    echo json_encode(['message' => 'Data updated successfully']);
  } else {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid data']);
  }
}
