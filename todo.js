/* Javascript for simple To-do list html page 
- by Kimberly Ruohio, for Laurea UAS Dynamic Web Applications with Javascript course */

/* Global code to accept keyboard entry. This is copied but goes to website functionality,
and I understand what's going on here.*/

document.addEventListener("keyup", function(event) {
    if (event.code === 'Enter') {
        
        put();
    }
});


/* The main function of the entire thing. Takes values from the myInput, date, and category fields.
Then it sets up the checkbox type, and the deleted button that goes next to each entry. It also sets up
rows with these values, for entry into the table. The function then checks to make sure the myInput field
isn't empty. The user doesn't have to enter a date, and that date doesn't need to be before today, nor
do they have to add a category. But the description field can't be empty. 

This function also sets up the delete button that appears next to rows, creating its span element for 
styling, and setsup its onclick attribute to call the delEntry function, sending that row to the function.

As long as the myInput field isn't empty, the values are sent to a new table row, and those values sent
to sessionStorage, so that the user can bring those values back into their respective fields for editing.
Data is then sent to localStorage, and the total and counter functions are called, and keeping track of 
completed tasks. */

function put() {

	var date = document.getElementById("extraDate").value;
	var description = document.getElementById("myInput").value;
	var category = document.getElementById("extraCategory").value;
	var checkbox = document.createElement("input");
	var deleteButton = document.createElement("span");
	var  deleteText = document.createTextNode("\u00D7");

	checkbox.type = "checkbox";
	checkbox.className = "center";

	deleteButton.appendChild(deleteText);
	deleteButton.className = "closeButton";
	deleteButton.setAttribute('onclick', 'delEntry(this)');

	var table = document.getElementById("list");
	var row = table.insertRow();
	
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	

	if (description == null || description == "") {

		document.getElementById("myInput").placeholder = "Please enter at least one character";

		document.getElementById("myInput").classList.add('input-placeholder-false');
		document.getElementById("myInput").style.border = "2px solid";
		document.getElementById("myInput").style.borderColor = "red";

		row.remove();

	} else {

			sessionStorage.setItem("myInput", document.getElementById("myInput").value);
			sessionStorage.setItem("extraDate", document.getElementById("extraDate").value);
			sessionStorage.setItem("extraCategory", document.getElementById("extraCategory").value);

			document.getElementById("myInput").classList.remove('input-placeholder-false');
			document.getElementById("myInput").style.border = "none";
			document.getElementById("myInput").placeholder = "Add your to-do here...";
	
			cell1.innerHTML = category;
			cell2.innerHTML = date;
    		cell3.innerHTML = description;
    		cell4.appendChild(checkbox);
    		cell5.appendChild(deleteButton);
		
    		document.getElementById("myInput").value = "";
   			document.getElementById("extraDate").value = "";
   			document.getElementById("extraCategory").value = "";

   			total();

   			completed();

   			getData();
   		}  
}


/* This function recalls the myInput, data, and category values back to their fields, and deletes that
last row containing those values from the table, so the user can edit them. It calls the total and completed
functions, as removing a row effects the count of tasks. */

function edit() {

	var rowCount = document.getElementById('list').rows.length;

	document.getElementById("myInput").value = sessionStorage.getItem("myInput");
	document.getElementById("extraDate").value = sessionStorage.getItem("extraDate");
	document.getElementById("extraCategory").value = sessionStorage.getItem("extraCategory");

	document.getElementById('list').deleteRow(rowCount - 1);

	total();

	completed();
}


/* This function handles checkbox states, for completed tasks. If a checkbox is checked, then that table row 
is struck-through, and the completed function called to keep count of completed tasks. If checkboxes are
unchecked, then style is altered to remove the line-through, and the count adjusted in the completed function
accordingly. The i counter is adjusted by 2, because there's one empty row at the start for appearance's sake.
The name attribute is set to checked, and reset from checked, so that the checked state can be more easily recalled 
from localStorage when the page reloads. */

function status() {

	var table = document.getElementById("list");
	var checkBoxes = table.getElementsByTagName("input");

	for (var i = 0; i < checkBoxes.length; i++) {

		if(checkBoxes[i].checked) {

			checkBoxes[i].setAttribute("name", 'checked');

			i += 2;

			table.rows[i].style = "text-decoration: line-through";


			i -= 2;

			completed();

		} else {

			checkBoxes[i].setAttribute("name", "");

			i += 2;

			table.rows[i].style = "";

			i -= 2;

			completed();
		}
	}
}


/* Shows only uncompleted tasks. If a checkbox is checked, then that row is hidden. The show and hide states are
not saved on page reload. If the user ends up hiding more than they intended, changes can be undone in the Edit 
dropdown menu, selecting Undo Delete, or by clicking Show All.*/

function hideCompleted() {

	var table = document.getElementById("list");
	var checkBoxes = table.getElementsByTagName("input");

	for (var i = 0; i < checkBoxes.length; i++) {

		if(checkBoxes[i].checked) {

			i += 2;

			table.rows[i].style.display = "none";

			i -= 2;
		} 
	}
}


/* Shows only completed tasks. If a checkbox is not checked, then that row is hidden from view. If the user ends up 
hiding more than they intended, changes can be undone in the Edit dropdown menu, selecting Undo delete, or by clicking
Show All. */

function onlyCompleted() {

	var table = document.getElementById("list");
	var checkBoxes = table.getElementsByTagName("input");

	for (var i = 0; i < checkBoxes.length; i++) {

		if(checkBoxes[i].checked == false) {

			i += 2;

			table.rows[i].style.display = "none";

			i -= 2;
		} 
	}
}


/* The delEntry function receives the row as defined in the put function, so that when the user clicks
On the X, the row is deleted. I understand parentNode.parentNode when it's suggested, but I wouldn't
yet come up with it myself. The total and completed functions are then called, as this effects the
count of tasks. As locaStorage is not called in any way, the user can undo the delete in the Edit
dropdown menu with 'Undo changes'. */

function delEntry(row) {

	var i = row.parentNode.parentNode.rowIndex;
    document.getElementById("list").deleteRow(i);

    total();

    completed();
}


/* Simply keeps a counter going of all tasks, the put function, delEntry function, and edit function call it, 
as they effect the count.*/

function total() {

	var table = document.getElementById("list");

	var totalRowCount = table.rows.length - 2;

	document.getElementById("total").innerHTML = "<li>Total Tasks: " +totalRowCount+ "</li>";

}


/* And this function keeps track of a count of completed tasks. If a checkbox is checked, that must mean
the task is completed. The put function, status function, delEntry function, and edit function call it,
as they all effect the count. */

function completed() {

	var table = document.getElementById("list");
	var checkBoxes = table.getElementsByTagName("input");

	var counter = 0;

	for (var i = 0; i < checkBoxes.length; i++) {

		if(checkBoxes[i].checked == true) {

			counter++;
		}
	}

	document.getElementById("completed").innerHTML = "<li>Completed Tasks: " +counter+ "</li>";
}


/* This function takes care of the styling of the buttons that are hidden on the initial page load. The
original version of this was a lot more, but divs are my friend. */

function date() {

	var z = document.getElementById("hide");
    z.style.display = "block";

}


// If the close button is clicked, then date and category input fields are hidden.

function closeInput() {

	var z = document.getElementById("hide");
    z.style.display = "none";
}


/* This function gathers values for localStorage. The table, and the counter values, are stored as
respective HTML chunks for easier retrieval. The function checks that the browser supports 
localStorage first. */

function getData() {


	if(typeof(Storage) !== "undefined") { 

		var table = document.getElementById('list').innerHTML;


		localStorage.setItem('tableContent', table);

		localStorage.setItem("total", document.getElementById("total").innerHTML);
		localStorage.setItem("completed", document.getElementById("completed").innerHTML);	

	} else {

		alert("Browser not supported");
	}
}


/* This function puts data back to where it belongs. For each value, it checks first if it's
not null, then puts the data back if it exists. Check box states are not saved by browsers, 
so in the status function, if a box is checked, then the name attribute is set, so that in
this function, it can search for the name attribute being set to checkbox. Then if it is, 
set the checkbox state to true. The function then applies the counter values. 

This function is also called when the user clicks the show all button, as functionally it 
does what it says on the tin. */

function putData() {


	if(localStorage.getItem("tableContent") !== null) {
    
    	var table = localStorage.getItem('tableContent');
    	document.getElementById('list').innerHTML = table;

    	var boxes = document.getElementsByName("checked");

    	for (var i = 0; i < boxes.length; i++) {

    		boxes[i].checked = true;
    	}
    }

	if(localStorage.getItem("total", document.getElementById("total").innerHTML) !== null) {

		document.getElementById("total").innerHTML = localStorage.getItem("total");
	}

	if(localStorage.getItem("completed", document.getElementById("completed").innerHTML) !== null) {

		document.getElementById("completed").innerHTML = localStorage.getItem("completed");
	}
}


/* Finally, this function removes anything still lingering in localStorage, first checking if there is
anything to remove. */

function removeData() {


	if(localStorage.getItem("tableContent") !== null) {

		localStorage.clear('tableContent');
	}

	if(localStorage.getItem("total", document.getElementById("total").innerHTML) !== null) {

		localStorage.clear('total');
	}

	if(localStorage.getItem("completed", document.getElementById("completed").innerHTML) !== null) {

		localStorage.clear("completed");
	}

	document.location.reload();
}