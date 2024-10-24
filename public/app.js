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
    $scope.showAcademicSchedules = false;
    $scope.showCreateSchedule1 = false;
    $scope.showCreateSchedule2 = false;
    $scope.showCreateSchedule3 = false;
    $scope.showAcademicDepartments = false;
    $scope.showAcademicDepartments2 = false;
    $scope.showAlerts = false;

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

    $scope.schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    
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
        $scope.showAcademicSchedules = false;
        $scope.showCreateSchedule1 = false;
        $scope.showCreateSchedule2 = false;
        $scope.showCreateSchedule3 = false;
        $scope.showAcademicDepartments = false;
        $scope.showAcademicDepartments2 =false;
        $scope.showAlerts = false;
        
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
        $scope.showAcademicSchedules = false;
        $scope.showCreateSchedule1 = false;
        $scope.showCreateSchedule2 = false;
        $scope.showCreateSchedule3 = false;
        $scope.showAcademicDepartments = false;
        $scope.showAcademicDepartments2 =false;
        $scope.showAlerts = false;
    };
    $scope.userForm = function() {
        console.log("User Form accounts button works");
        $scope.showCalender = false;
        $scope.showUsers =false;
        $scope.openForm = false;
        $scope.showUserForm = true;
        $scope.showAcademicSchedules = false;
        $scope.showCreateSchedule1 = false;
        $scope.showCreateSchedule2 = false;
        $scope.showCreateSchedule3 = false;
        $scope.showAcademicDepartments = false;
        $scope.showAcademicDepartments2 =false;
        $scope.showAlerts = false;
    };
    $scope.academicSch = function() {
        $scope.loadSchedules();
        console.log("User Form accounts button works");
        $scope.showCalender = false;
        $scope.showUsers =false;
        $scope.openForm = false;
        $scope.showUserForm = false;
        $scope.showAcademicSchedules = true;
        $scope.showCreateSchedule1 = false;
        $scope.showCreateSchedule2 = false;
        $scope.showCreateSchedule3 = false;
        $scope.showAcademicDepartments = false;
        $scope.showAcademicDepartments2 =false;
        $scope.showAlerts = false;
    };
    

$scope.createSchedule = function() {
    $scope.showCalender = false;
    $scope.showUsers =false;
    $scope.openForm = false;
    $scope.showUserForm = false;
    $scope.showCreateSchedule2 = false;
    $scope.showCreateSchedule3 = false;
    $scope.showAcademicDepartments = false;
    $scope.showAcademicDepartments2 =false;
    $scope.showAlerts = false;
    console.log("Creating new schedule");
    $scope.schedule = {
        name: '',
        description: '',
        periods: [],
        videoConference: '',
        location: ''
    };
    $scope.showAcademicSchedules = false;
    $scope.showCreateSchedule1 = true;
};


$scope.createSchedule2 = function() {
    $scope.showCalender = false;
    $scope.showUsers =false;
    $scope.openForm = false;
    $scope.showUserForm = false;
    $scope.showAcademicSchedules = false;
    $scope.showCreateSchedule3 = false;
    $scope.showAcademicDepartments = false;
    $scope.showAcademicDepartments2 =false;
    $scope.showAlerts = false;
    if (!$scope.schedule || !$scope.schedule.name || !$scope.schedule.description) {
        alert("Please enter both name and description.");
    } else {
        // Add new schedule to the schedules array
        $scope.schedules.push({
            name: $scope.schedule.name,
            description: $scope.schedule.description
        });

        // Save the updated schedules array to local storage
        localStorage.setItem('schedules', JSON.stringify($scope.schedules));

        // Clear input fields after adding
        $scope.schedule.name = '';
        $scope.schedule.description = '';

        // Proceed to the next schedule creation step
        $scope.showCreateSchedule1 = false;
        $scope.showCreateSchedule2 = true;
    }
};


$scope.createSchedule3 = function() {
    $scope.showCalender = false;
    $scope.showUsers =false;
    $scope.openForm = false;
    $scope.showUserForm = false;
    $scope.showAcademicSchedules = false;
    $scope.showCreateSchedule1 = false;
    $scope.showAcademicDepartments = false;
    $scope.showAcademicDepartments2 =false;
    $scope.showAlerts = false;
    console.log("Proceeding to Advanced Options");

    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const bookable = document.getElementById('bookable').checked;

    const days = [];
    document.querySelectorAll('input[name="days"]:checked').forEach((day) => {
        days.push(day.id);
    });

    if (startTime && endTime && days.length > 0) {
        // Add periods to the schedule
        $scope.schedule.periods.push({
            startTime,
            endTime,
            bookable,
            days
        });

        $scope.showCreateSchedule2 = false;
        $scope.showCreateSchedule3 = true;
    } else {
        alert("Please enter a valid time period and select at least one day.");
    }
};

$scope.saveSchedule = function() {
    console.log("Saving schedule");

    const videoConference = document.getElementById('video-conference').value;
    const location = document.getElementById('location').value;

    $scope.schedule.videoConference = videoConference;
    $scope.schedule.location = location;

    $scope.schedules.push($scope.schedule);
    localStorage.setItem('schedules', JSON.stringify($scope.schedules));

    $scope.showCreateSchedule3 = false;
    $scope.showAcademicSchedules = true;
};

$scope.loadSchedules = function() {
    $scope.schedules = JSON.parse(localStorage.getItem('schedules')) || [];
};

$scope.deleteSchedule = function(index) {
    $scope.schedules.splice(index, 1);

    localStorage.setItem('schedules', JSON.stringify($scope.schedules));
};


$scope.editSchedule = function(index) {
    $scope.schedule = angular.copy($scope.schedules[index]);

    $scope.updateSchedule = function() {
        $scope.schedules[index] = angular.copy($scope.schedule);

        localStorage.setItem('schedules', JSON.stringify($scope.schedules));

        $scope.schedule = {};
    };
};










if (!localStorage.getItem('departments')) {
    localStorage.setItem('departments', JSON.stringify([]));
}

$scope.acedemicDepartments = function() {
    console.log("Displaying the departments");
    $scope.showCalender = false;
    $scope.showUsers = false;
    $scope.openForm = false;
    $scope.showUserForm = false;
    $scope.showAcademicSchedules = false;
    $scope.showCreateSchedule1 = false;
    $scope.showCreateSchedule2 = false;
    $scope.showCreateSchedule3 = false;
    $scope.showAcademicDepartments = true;
    $scope.showAcademicDepartments2 = false;
    $scope.showAlerts = false;

    $scope.departments = JSON.parse(localStorage.getItem('departments')) || [];
};

$scope.acedemicDepartment2 = function() {
    console.log("Opening the department form");
    $scope.showCalender = false;
    $scope.showUsers = false;
    $scope.openForm = false;
    $scope.showUserForm = false;
    $scope.showAcademicSchedules = false;
    $scope.showCreateSchedule1 = false;
    $scope.showCreateSchedule2 = false;
    $scope.showCreateSchedule3 = false;
    $scope.showAcademicDepartments = false;
    $scope.showAcademicDepartments2 = true;
    $scope.showAlerts = false;
};
$scope.alertsStart = function() {
    console.log("Opening the department form");
    $scope.showCalender = false;
    $scope.showUsers = false;
    $scope.openForm = false;
    $scope.showUserForm = false;
    $scope.showAcademicSchedules = false;
    $scope.showCreateSchedule1 = false;
    $scope.showCreateSchedule2 = false;
    $scope.showCreateSchedule3 = true;
    $scope.showAcademicDepartments = false;
    $scope.showAcademicDepartments2 = false;
    $scope.showAlerts = true;
};

$scope.acedemicDepartment = function() {
    console.log("Saving department");

    const departmentName = $scope.department.name;
    const departmentDescription = $scope.department.description;

    if (departmentName && departmentDescription) {
        const newDepartment = {
            name: departmentName,
            description: departmentDescription
        };

        const departments = JSON.parse(localStorage.getItem('departments')) || [];

        departments.push(newDepartment);

        localStorage.setItem('departments', JSON.stringify(departments));

        $scope.department.name = '';
        $scope.department.description = '';

        $scope.acedemicDepartments();
    } else {
        alert("Please enter both name and description.");
    }
};


    $scope.saveUserFormData = function() {
        const formData = {
            schoolName: $scope.userForm.schoolName,
            websiteAddress: $scope.userForm.websiteAddress,
            deleteLogo: $scope.userForm.deleteLogo
        };

        if ($scope.userForm.logoFile) {
            const reader = new FileReader();
            reader.onloadend = function() {
                formData.logoFile = reader.result;
                saveDataToLocalStorage(formData);
            };
            reader.readAsDataURL($scope.userForm.logoFile);
        } else {
            saveDataToLocalStorage(formData);
        }
    };


    $scope.deleteDepartment = function(index) {
        const departments = JSON.parse(localStorage.getItem('departments'));
        departments.splice(index, 1);
        localStorage.setItem('departments', JSON.stringify(departments));
        $scope.acedemicDepartments(); // Refresh the view
    };
    
    function saveDataToLocalStorage(formData) {
        localStorage.setItem('userFormData', JSON.stringify(formData));
        console.log('User Form Data Saved:', formData);
        alert('Data saved successfully in local storage!');
    }

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
        $scope.showAcademicSchedules = false;
        $scope.showCreateSchedule1 = false;
        $scope.showCreateSchedule2 = false;
        $scope.showCreateSchedule3 = false;
        $scope.showAcademicDepartments = false;
        $scope.showAcademicDepartments2 =false;
        $scope.showAlerts = false;
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
