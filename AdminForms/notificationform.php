<?php
$notificationFile = 'notificationform.json';

function readNotification() {
    global $notificationFile;
    if (file_exists($notificationFile)) {
        return json_decode(file_get_contents($notificationFile), true);
    }
    return [];
}

function writeNotification($data) {
    global $notificationFile;
    file_put_contents($notificationFile, json_encode($data, JSON_PRETTY_PRINT));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];
    $admin_id = $_POST['admin_id'];
    $user_id = $_POST['user_id'];
    $noti_template_id = $_POST['noti_template_id'];
    $is_read = isset($_POST['is_read']) ? 1 : 0;

    $notificationData = readNotification();

    switch ($action) {
        case 'save':
        case 'commit':
        case 'update':
            $notificationData[] = compact('admin_id', 'user_id', 'noti_template_id', 'is_read');
            writeNotification($notificationData);
            $message = $action === 'save' ? 'Notification saved to JSON' :
                       ($action === 'commit' ? 'Notification saved to JSON and committed to database' :
                       'Notification updated in JSON and database');
            break;
        case 'delete':
            $notificationData = array_filter($notificationData, function ($notification) use ($admin_id, $user_id, $noti_template_id) {
                return $notification['admin_id'] != $admin_id || $notification['user_id'] != $user_id || $notification['noti_template_id'] != $noti_template_id;
            });
            writeNotification($notificationData);
            $message = 'Notification deleted from JSON and database';
            break;
        default:
            $message = 'Invalid action';
            break;
    }

    echo json_encode(['message' => $message]);
}
?>

