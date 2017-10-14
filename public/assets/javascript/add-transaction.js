// this file isn't finished yet...
$(document).ready(function() {
	// When user clicks submit on the transaction
	$(".modalSubmit").on("click", function(event) {
	  event.preventDefault();
	  if ($("input[type=checkbox").prop("checked")) {
		  // Make a newTransaction object
		  var newTransaction = {
		    Balance: 
		    Amount: $(".amount").val().trim(),
		    Category: $(".dropCont").val().trim(),
		    Description: $(".description").val().trim()
		  };
	  } else {
		  // Make a newTransaction object
		  var newTransaction = {
		    Balance: 
		    Amount: $(".amount").val().trim(),
		    Category: $(".dropCont").val().trim(),
		    Description: $(".description").val().trim()
		  };
	  }
	  // Send an AJAX POST-request with jQuery
	  $.post("/api/transactions", newTransaction)
	    // On success, run the following code
	    .done(function(data) {
	      // Log the data we found
	      console.log(data);
	    });
  // Empty each input box by replacing the value with an empty string
	  $(".amount").val("");
	  $(".dropCont").val("");
	  $(".description").val("");
	});
});