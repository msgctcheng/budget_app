$(document).ready(function() {
// container that holds all the transactions
	var transactionsContainer = $(".transactions-container")
	// variable to hold our transactions
	var transactions;
	// the code below handles the case where we want to get the transactions
	// for a specific user looks for query param in the url (needs work)
	var url = window.location.search;
	var userId;
	if (url.indexOf("?user_id=") !== -1) {
		userId = url.split("=")[1];
		getTransactions(userId);
	} else {
		getTransactions();
	}
	// This function grabs transactions from the db and updates card
	function getTransactions(user) {
		userId = user || "";
		if (userId) {
			userId = "/?user_id=" + userId;
		}
		$.get("/api/transactions" + userId, function(data) {
			for (var j = 0; j < data.length; j++) {
				console.log("Transactions", data[j]);
				transactions = data[j];
				if (!transactions || !transactions.length) {
					displayEmpty(user);
				} else {
					initializeRows();
				}
			}
		});
	}
	// initializeRows handles appending all of our constructed transaction HTML
	// inside the transactionsContainer
	function initializeRows() {
		transactionsContainer.empty();
		var transToAdd = [];
		for (var i = 0; i < transactions.length; i++) {
			transToAdd.push(transactions[i]);
		}
		transactionsContainer.append(transToAdd);
	}
	// This function isn't working to create rows of transactions to HTML
	// function createNewRow(transaction) {
	// 	var newTransPanel = $("<div>");
	// 	newTransPanel.addClass("panel-heading");
	// 	var newTransPanel = $("<div>");
 //    newTransPanel.addClass("panel panel-default");
 //    var newTransPanelHeading = $("<div>");
 //    newTransPanelHeading.addClass("panel-heading");
 //    var newTransAmount = $("<h2>");
 //    var newTransCategory = $("<small>");
 //    var newTransDescription = $("<h5>");
 //    var newTransPanelBody = $("<div>");
 //    newTransPanelBody.addClass("panel-body");
 //    var newTransBody = $("<p>");
 //    newTransAmount.text(transaction.amount + " ");
 //    newTransCategory.text(transaction.category);
 //    newTransPanelBody.append(newTransBody);
 //    newTransPanel.append(newTransPanelHeading);
 //    newTransPanel.append(newTransPanelBody);
 //    newTransPanel.data("Trans", transaction);
 //    return newTransPanel;
	// }
	// This function displays a message when there are no transactions
	function displayEmpty(id) {
		var query = window.location.search;
    transactionsContainer.empty();
    var messageh2 = $("<h2>");
    messageh2.css({ "text-align": "center", "margin-top": "50px" });
    messageh2.html("No transactions yet");
    transactionsContainer.append(messageh2);
	}

});