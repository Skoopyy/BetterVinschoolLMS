// ==UserScript==
// @name         Better Vinschool LMS
// @namespace    https://github.com/Skoopyy/BetterVinschoolLMS
// @version      1.3
// @updateURL    https://raw.githubusercontent.com/Skoopyy/BetterVinschoolLMS/main/main.js
// @downloadURL  https://raw.githubusercontent.com/Skoopyy/BetterVinschoolLMS/main/main.js
// @description  General UI/UX Improvements for the Vinschool LMS (Canvas LMS/LMS version 1)
// @author       Skoopyy on Github
// @match        https://online.vinschool.edu.vn/*
// @match        https://lms.vinschool.edu.vn/*
// @icon         https://online.vinschool.edu.vn/logo1.svg
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS styles for the snackbar
    var styles = `
        #snackbar {
            visibility: hidden;
            min-width: 250px;
            margin-left: -125px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 2px;
            padding: 5px;
            position: fixed;
            z-index: 9999;
            left: 50%;
            bottom: 30px;
            font-size: 17px;
        }

        #snackbar.show {
            visibility: visible;
            animation: fadein 0.5s, fadeout 0.5s 2.5s;
        }

        @keyframes fadein {
            from {bottom: 0; opacity: 0;}
            to {bottom: 30px; opacity: 1;}
        }

        @keyframes fadeout {
            from {bottom: 30px; opacity: 1;}
            to {bottom: 0; opacity: 0;}
        }
    `;
    var styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // Create snackbar element
    var snackbar = document.createElement('div');
    snackbar.id = 'snackbar';
    snackbar.textContent = 'No text provided.';
    document.body.appendChild(snackbar);

    // Function to show the snackbar
    function showSnackbar(text) {
        snackbar.textContent = text;
        snackbar.classList.add('show');
        setTimeout(function() {
            snackbar.classList.remove('show');
        }, 3000);
    }

    // Check if the current URL matches the specified pattern - URL
    function checkURL(pattern) {
        return window.location.href.startsWith(pattern);
    }
    // Delete elements by XPath
    function deleteElementsByXPath(xpaths) {
        xpaths.forEach(function(xpath) {
            var elements = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var i = 0; i < elements.snapshotLength; i++) {
                var element = elements.snapshotItem(i);
                if (element) {
                    element.remove();
                }
            }
        });
    }
    // If login page, automatically login
    if (checkURL('https://online.vinschool.edu.vn/login')) {
    // Create element for logging in overlay
    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'none'; // Initially hide overlay

    // Create element for text
    var textElement = document.createElement('p');
    textElement.textContent = 'Logging in...';
    textElement.style.color = '#fff';
    textElement.style.fontSize = '24px';
    textElement.style.position = 'absolute';
    textElement.style.top = '50%';
    textElement.style.left = '50%';
    textElement.style.transform = 'translate(-50%, -50%)';

    // Append text element to overlay
    overlay.appendChild(textElement);

    // Append overlay to body
    document.body.appendChild(overlay);

    // Create element for image overlay
    var imageOverlay = document.createElement('img');
    imageOverlay.src = 'https://online.vinschool.edu.vn/static/media/loginbg.73ec9217b389d5f9aacf.jpeg';
    imageOverlay.style.position = 'fixed';
    imageOverlay.style.top = '0';
    imageOverlay.style.left = '0';
    imageOverlay.style.width = '100%';
    imageOverlay.style.height = '100%';
    imageOverlay.style.objectFit = 'cover';
    imageOverlay.style.zIndex = '9998';

    // Append image overlay to body
    document.body.appendChild(imageOverlay);

    function clickButton() {
        var button = document.evaluate(
            '//*[@id="root"]/div/div/div/button[1]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (button) {
            // Show logging in overlay when login func called
            console.log("Better VSC LMS | Logging in...");
            overlay.style.display = 'block';
            button.click();
        } else {
            console.log("Better VSC LMS | Button not found yet...");
        }
    }

    // Call login func when page loaded
    window.addEventListener('load', clickButton);

    document.title = "Logging in...";
}
    // Optimize UI/UX exp for user - delete unwanted elements
    var xpathsToDelete = [
        // Sidebar
        '//*[@id="global_nav_help_link"]', // Help - Nothing usable
        '//*[@id="global_nav_history_link"]', // History button -  Why does an average user need this anyways
        '//*[@id="global_nav_calendar_link"]', // Calendar button - Does close to nothing on Canvas LMS cause quizzes rarely have due dates also the todo list exists for a reason
        '//*[@id="context_external_tool_639_menu_item"]/a', // SWB - Accessible thru external page
        '//*[@id="context_external_tool_784_menu_item"]/a', // Clise - Accessible thru external page
    ];



    // If unauthorized message element is detected, execute actions
    if (document.evaluate('//*[@id="unauthorized_message"]/h1', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
        // Create loading message element
        var loadingMessage = document.createElement('div');
        loadingMessage.style.position = 'fixed';
        loadingMessage.style.top = '50%';
        loadingMessage.style.left = '50%';
        loadingMessage.style.transform = 'translate(-50%, -50%)';
        loadingMessage.style.fontSize = '24px';
        loadingMessage.style.fontWeight = 'bold';
        loadingMessage.style.color = 'rgba(0, 0, 0, 0.5)';
        loadingMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        document.body.appendChild(loadingMessage);
        showSnackbar("Redirecting to dashboard...");

        // Hide main content while loading
        document.body.style.opacity = '0.5'; // Reduce opacity

        setTimeout(function() {
            console.log("Better VSC LMS | Login page bug - Redirecting to dashboard");
            document.title = "Vinschool LMS - Loading";
            window.location.href = 'https://lms.vinschool.edu.vn';
        }, 0.5);
    }

    function addTitlePrefix(prefix) {
        var pageTitle = document.title;
        // check if on lms v2 to not have duplicate titles
        var newTitle = prefix + ' - ' + pageTitle;
        if (pageTitle == "Vinschool LMS") {
            newTitle = "Vinschool LMS v2"
        }
        document.title = newTitle;
        console.log("Better VSC LMS | Changed webpage title to: " + newTitle);
    }

    // If on dashboard, do UI/UX improvements
    if (checkURL('https://lms.vinschool.edu.vn/')) {
        console.log("Better VSC LMS | Loaded...");
        // window.addEventListener('load', deleteElementsByXPath(xpathsToDelete)); // Optimize UI/UX exp doesnt work rn
    }
    addTitlePrefix("Vinschool LMS");
})();