var app = angular.module('myApp', []);

app.controller('MyController', function($scope, $http, $document, $window) {
    $scope.selectedView = 'none'; // Default value
    $scope.isDropdownVisible = false; // Track dropdown visibility

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
        
        if ($scope.selectedView === 'day') {
            fetch('day_calender.html')
                .then(response => response.text())
                .then(data => {
                    contentDiv.innerHTML = data;
                })
                .catch(error => console.error('Error loading day calendar:', error));
        } else if ($scope.selectedView === 'week') {
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
        console.log("user accounts button is work");
        var contentDiv = document.getElementById('calendar-content');
        fetch('user.html')
                .then(response => response.text())
                .then(data => {
                    contentDiv.innerHTML = data;
                })
                .catch(error => console.error('Error loading day calendar:', error));
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
