document.getElementById('saveButton').addEventListener('click', saveNotification);
document.getElementById('commitButton').addEventListener('click', commitNotification);
document.getElementById('updateButton').addEventListener('click', updateNotification);
document.getElementById('deleteButton').addEventListener('click', deleteNotification);
document.getElementById('nextButton').addEventListener('click', nextNotification);
document.getElementById('prevButton').addEventListener('click', prevNotification);

let currentNotificationIndex = 0;
const totalNotifications = 50;

function saveNotification() {
    const formData = new FormData(document.getElementById('notificationForm'));
    formData.append('action', 'save');
    sendNotification(formData);
}

function commitNotification() {
    const formData = new FormData(document.getElementById('notificationForm'));
    formData.append('action', 'commit');
    sendNotification(formData);
}

function updateNotification() {
    const formData = new FormData(document.getElementById('notificationForm'));
    formData.append('action', 'update');
    sendNotification(formData);
}

function deleteNotification() {
    const formData = new FormData(document.getElementById('notificationForm'));
    formData.append('action', 'delete');
    sendNotification(formData);
}

function nextNotification() {
    if (currentNotificationIndex < totalNotifications - 1) {
        currentNotificationIndex++;
        loadNotification(currentNotificationIndex);
    } else {
        alert('This is the last page');
    }
}

function prevNotification() {
    if (currentNotificationIndex > 0) {
        currentNotificationIndex--;
        loadNotification(currentNotificationIndex);
    } else {
        alert('This is the first page');
    }
}

function loadNotification(index) {
    fetch(`load_notification.php?index=${index}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('admin_id').value = data.admin_id;
            document.getElementById('user_id').value = data.user_id;
            document.getElementById('noti_template_id').value = data.noti_template_id;
            document.getElementById('is_read').checked = data.is_read;
        });
}

function sendNotification(formData) {
    fetch('process_notification.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    });
}
