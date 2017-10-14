function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var currentURL = window.location.origin;
    var id_token = googleUser.getAuthResponse().id_token;
    // commit
    if (window.location.href !== window.location.origin + "/newUser") {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', currentURL + "/login/verify");
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            console.log('Signed in as: ' + xhr.responseText);
            if (xhr.responseText === "false") {
                window.location = currentURL + "/newUser";
            } else if (window.location.href !== window.location.origin + "/") {
            	window.location = currentURL + "/";
            }
        };
        xhr.send('idtoken=' + id_token);

    } else if (window.location.href === window.location.origin + "/newUser") {
    	$(".newSubmit").on("click", function() {

	        var userInfo = {
	                name: $(".userName").val().trim(),
	                amount: $(".firstBudget").val().trim(),
	                googleId: profile.getEmail()
	            }

	        var currentURL = window.location.origin;

	        $.ajax({
	            type: "POST",
	            url: currentURL + "/addUser",
	            data: userInfo
	        }).success(function(response) {

	            window.location = currentURL + "/";
	        });
	    });
    }

}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
    });
}