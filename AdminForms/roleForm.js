document.addEventListener('DOMContentLoaded', function() {
    const roleForm = document.getElementById('roleForm');
    const saveBtn = document.getElementById('saveBtn');
    const commitBtn = document.getElementById('commitBtn');
    const updateBtn = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const exportBtn = document.getElementById('exportBtn');
    const pageNumber = document.createElement('div');
    pageNumber.className = 'page-number';
    document.querySelector('.role-form-container').appendChild(pageNumber);

    let currentIndex = -1;
    let data = [];

    if (localStorage.getItem('roleData')) {
        data = JSON.parse(localStorage.getItem('roleData'));
    }

    function updatePageNumber() {
        pageNumber.textContent = `Page: ${currentIndex + 1} of ${data.length}`;
    }

    saveBtn.addEventListener('click', function() {
        const formData = new FormData(roleForm);
        const newRole = {
            roleName: formData.get('roleName'),
            permission: formData.get('permission')
        };
        data.push(newRole);
        saveToDesktopFile(newRole);
        saveToLocalStorage();
        clearForm();
        currentIndex = data.length - 1; // Update current index to the new last item
        updatePageNumber();
    });

    commitBtn.addEventListener('click', function() {
        const formData = new FormData(roleForm);
        const newRole = {
            roleName: formData.get('roleName'),
            permission: formData.get('permission')
        };
        data.push(newRole);
        saveToDesktopFile(newRole);
        commitToDatabase(newRole);
        saveToLocalStorage();
        clearForm();
        currentIndex = data.length - 1; // Update current index to the new last item
        updatePageNumber();
    });

    updateBtn.addEventListener('click', function() {
        if (currentIndex !== -1) {
            const formData = new FormData(roleForm);
            data[currentIndex].roleName = formData.get('roleName');
            data[currentIndex].permission = formData.get('permission');
            saveToLocalStorage();
            alert('Data updated.');
        } else {
            alert('Select a record to update.');
        }
        updatePageNumber();
    });

    deleteBtn.addEventListener('click', function() {
        if (currentIndex !== -1) {
            data.splice(currentIndex, 1);
            saveToLocalStorage();
            clearForm();
            currentIndex = Math.min(currentIndex, data.length - 1);
            alert('Record deleted.');
            updatePageNumber();
        } else {
            alert('Select a record to delete.');
        }
    });

    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            displayCurrentRecord();
        } else {
            alert('You are at the first record.');
        }
        updatePageNumber();
    });

    nextBtn.addEventListener('click', function() {
        if (currentIndex < data.length - 1) {
            currentIndex++;
            displayCurrentRecord();
        } else {
            alert('You are at the last record.');
        }
        updatePageNumber();
    });

    exportBtn.addEventListener('click', function() { // New Export Button Event Listener
        exportLocalStorageToFile();
    });

    function saveToLocalStorage() {
        localStorage.setItem('roleData', JSON.stringify(data));
    }

    function saveToDesktopFile(newRole) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'php/saveRoleToFile.php', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.status === 'success') {
                    alert('Data saved to desktop file.');
                } else {
                    alert('Error saving data to desktop file.');
                }
            }
        };
        xhr.send(JSON.stringify(newRole));
    }

    function commitToDatabase(newRole) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'php/saveRoleToDatabase.php', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.status === 'success') {
                    alert('Data committed to database.');
                } else {
                    alert('Error committing data to database.');
                }
            }
        };
        xhr.send(JSON.stringify(newRole));
    }

    function displayCurrentRecord() {
        if (currentIndex >= 0 && currentIndex < data.length) {
            const currentRole = data[currentIndex];
            roleForm.roleName.value = currentRole.roleName;
            roleForm.permission.value = currentRole.permission;
        }
    }

    function clearForm() {
        roleForm.reset();
        currentIndex = -1;
        updatePageNumber();
    }

    function exportLocalStorageToFile() { // New Export Function
        const data = localStorage.getItem('roleData');
        if (data) {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'php/exportLocalStorage.php', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.status === 'success') {
                        alert('Local storage data exported to file.');
                    } else {
                        alert('Error exporting data to file.');
                    }
                }
            };
            xhr.send(data);
        } else {
            alert('No data in local storage to export.');
        }
    }

    // Initialize page number
    updatePageNumber();
});
