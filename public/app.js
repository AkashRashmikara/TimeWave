var app = angular.module('myApp', []);

app.controller('MyController', function($scope, $http, $document, $window) {
    $scope.selectedView = 'none'; // Default value
    $scope.isDropdownVisible = false; // Track dropdown visibility
    const today = new Date();
    $scope.year = today.getFullYear();
    $scope.month = today.getMonth();
    $scope.monthName = getMonthName($scope.month);
    $scope.openForm = false;
    $scope.showUsers =false;
    $scope.showCalender = false;
    $scope.showUserForm = false;

      $scope.user = {
        name: '',
        userType: 'admin', // Default to admin
        activated: false,
        email: '',
        password: '',
        confirmPassword: '',
        applyChanges: false,
        firstName: '',
        lastName: '',
        displayName: '',
        department: 'hr', // Default to HR
        mobile: ''
    };
    $scope.userForm = {
        schoolName: '',
        websiteAddress: '',
        logoFile: null,
        deleteLogo: false
    };
    $scope.updateCalendar = function() {
        const firstDayOfMonth = new Date($scope.year, $scope.month, 1).getDay();
        const daysInMonth = new Date($scope.year, $scope.month + 1, 0).getDate();
        const daysInPrevMonth = new Date($scope.year, $scope.month, 0).getDate();
        
        let calendarDays = [];
        
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            calendarDays.push({ day: daysInPrevMonth - i, isPrevMonth: true });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === today.getDate() && $scope.month === today.getMonth() && $scope.year === today.getFullYear();
            calendarDays.push({ day: i, isToday: isToday });
        }

        const remainingCells = (7 - (calendarDays.length % 7)) % 7;
        for (let i = 1; i <= remainingCells; i++) {
            calendarDays.push({ day: i, isNextMonth: true });
        }

        $scope.calendarDays = calendarDays;
    };

    // Functions to change the month
    $scope.nextMonth = function() {
        if ($scope.month === 11) {
            $scope.month = 0;
            $scope.year++;
        } else {
            $scope.month++;
        }
        $scope.monthName = getMonthName($scope.month);
        $scope.updateCalendar();
    };

    $scope.prevMonth = function() {
        if ($scope.month === 0) {
            $scope.month = 11;
            $scope.year--;
        } else {
            $scope.month--;
        }
        $scope.monthName = getMonthName($scope.month);
        $scope.updateCalendar();
    };

    function getMonthName(monthIndex) {
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                            "July", "August", "September", "October", "November", "December"];
        return monthNames[monthIndex];
    }

    $scope.updateCalendar()


    $scope.toggleDropdown = function(event) {
        console.log("button works");
        $scope.isDropdownVisible = !$scope.isDropdownVisible;
        event.stopPropagation(); // Prevent the window event listener from closing it immediately
    };

    // Close the dropdown if the user clicks outside of it
    $document.on('click', function(event) {
        // Check if the click is outside the profile dropdown
        if (!event.target.closest('.profile-dropdown')) {
            $scope.$apply(function() {
                $scope.isDropdownVisible = false; // Close the dropdown
            });
        }
    });

    $scope.showCalendarView = function() {
        var contentDiv = document.getElementById('calendar-content');
        $scope.openForm = false;
        $scope.showUsers =false;
        $scope.showUserForm = false;
        
        if ($scope.selectedView === 'day') {
            
    $scope.showCalender = true;
            fetch('day_calender.html')
                .then(response => response.text())
                .then(data => {
                    contentDiv.innerHTML = data;
                })
                .catch(error => console.error('Error loading day calendar:', error));
        } else if ($scope.selectedView === 'week') {
            $scope.showCalender = true;
            fetch('week_calender.html')
                .then(response => response.text())
                .then(data => {
                    contentDiv.innerHTML = data;
                })
                .catch(error => console.error('Error loading week calendar:', error));
        } else {
            contentDiv.innerHTML = '';
            location.reload();
        }
    };

    $scope.userAccounts = function() {
        console.log("User accounts button works");
        $scope.showCalender = false;
        $scope.showUsers =false;
        $scope.openForm = true;
        $scope.showUserForm = false;
    };
    $scope.userForm = function() {
        console.log("User Form accounts button works");
        $scope.showCalender = false;
        $scope.showUsers =false;
        $scope.openForm = false;
        $scope.showUserForm = true;
    };

    $scope.saveUserFormData = function() {
        // Create formData object
        const formData = {
            schoolName: $scope.userForm.schoolName,
            websiteAddress: $scope.userForm.websiteAddress,
            deleteLogo: $scope.userForm.deleteLogo
        };

        // If there is a file selected, convert it to Base64
        if ($scope.userForm.logoFile) {
            const reader = new FileReader();
            reader.onloadend = function() {
                // Once file is converted to Base64, add it to formData and save to localStorage
                formData.logoFile = reader.result;
                saveDataToLocalStorage(formData);
            };
            reader.readAsDataURL($scope.userForm.logoFile);
        } else {
            saveDataToLocalStorage(formData);
        }
    };

    // Helper function to save data to localStorage
    function saveDataToLocalStorage(formData) {
        localStorage.setItem('userFormData', JSON.stringify(formData));
        console.log('User Form Data Saved:', formData);
        alert('Data saved successfully in local storage!');
    }

    // Function to handle form cancel
    $scope.cancelForm = function() {
        $scope.userForm = {
            schoolName: '',
            websiteAddress: '',
            logoFile: null,
            deleteLogo: false
        };
        alert('Form canceled');
    };

// Directive to handle file input binding
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

    $scope.submitForm = function() {
        if ($scope.user.password === $scope.user.confirmPassword) {
            console.log('Form submitted successfully:', $scope.user);
            
            // Get existing user data from local storage
            let existingUserData = [];
            for (let i = 1; i <= localStorage.length; i++) {
                const userData = localStorage.getItem(`userdata${i}`);
                if (userData) {
                    existingUserData.push(userData);
                }
            }
            
            // Determine the next user entry index
            const nextIndex = existingUserData.length + 1; // Incrementing from the count
            $window.localStorage.setItem(`userdata${nextIndex}`, JSON.stringify($scope.user)); // Store as JSON string
            
            // Optionally, reset the form fields after submission
            $scope.user = {
                name: '',
                userType: 'admin', // Default to admin
                activated: false,
                email: '',
                password: '',
                confirmPassword: '',
                applyChanges: false,
                firstName: '',
                lastName: '',
                displayName: '',
                department: 'hr', // Default to HR
                mobile: ''
            };

            $scope.accessControl();

        } else {
            alert('Passwords do not match. Please try again.'); 
        }
    };

    // Function to retrieve and display all users
    $scope.accessControl = function() {
        $scope.showCalender = false;
        $scope.showUsers =true;
        $scope.openForm = false;
        $scope.showUserForm = false;
        let allUsers = [];
        for (let i = 1; i <= localStorage.length; i++) {
            const userData = localStorage.getItem(`userdata${i}`);
            if (userData) {
                allUsers.push(JSON.parse(userData)); // Parse back to object
            }
        }
        console.log('All users:', allUsers); // Log to console

        // Optional: Display the users on the page (you can customize this as needed)
        $scope.allUsersList = allUsers; // Store in scope to use in HTML
    };

    $scope.editUser = function(user) {
        // Store the user data in local storage
        $window.localStorage.setItem('editingUser', JSON.stringify(user));
        // Navigate to user.html
        $window.location.href = 'user.html';
    };
    
    $scope.deleteUser = function(user) {
        // Logic to delete the user
        const index = $scope.allUsersList.indexOf(user);
        if (index > -1) {
            $scope.allUsersList.splice(index, 1); // Remove from local array
            localStorage.removeItem(`userdata${index + 1}`); // Remove from local storage
            alert('User deleted successfully!');
            $scope.displayAllUsers(); // Refresh the table
        }
    };


    
    $document.addEventListener = ('DOMContentLoaded', function() {
        const profileDropdown = document.querySelector('.profile-dropdown');
        const dropdownMenu = document.getElementById('dropdown-menu');

        profileDropdown.addEventListener('click', function() {
            // Toggle visibility
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
            console.log('Dropdown clicked, current display:', dropdownMenu.style.display); // Debug log
        });

        // Close the dropdown if the user clicks outside of it
        $window.addEventListener('click', function(event) {
            if (!event.target.closest('.profile-dropdown')) {
                dropdownMenu.style.display = 'none'; // Hide dropdown
                console.log('Clicked outside, hiding dropdown'); // Debug log
            }
        });

        // Logout action (Optional)
        $document.getElementById('logout-option').addEventListener('click', function() {
            alert('Logging out...'); // Replace with actual logout functionality
        });
    });
});
