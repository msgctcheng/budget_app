function openTab(tabName, tabCont, elmnt, color) {
    var tabcontent;
    var tablinks;

    //Hide content by default
    tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    // Show the specific tab content
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabCont).style.display = "block"

    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
    document.getElementById(tabName).style.backgroundColor = color;
    document.getElementById(tabCont).style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();




$(".modalButton").on("click", function () {
    modal.style.display = "block";
});

$(".closeModal").on("click", function () {
    modal.style.display="none";
});
        
window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display="none";
        }
    }