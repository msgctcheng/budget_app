function openTab(tabName, tabCont, elmnt, color) {
    var tabcontent;
    var tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabCont).style.display = "block"

    elmnt.style.backgroundColor = color;
    document.getElementById(tabName).style.backgroundColor = color;
    document.getElementById(tabCont).style.backgroundColor = color;
}

document.getElementById("defaultOpen").click();



$(".modalSubmit").on("click", function() {
    modal.style.display="none";
});

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