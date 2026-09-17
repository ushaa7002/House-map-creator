// Store rooms

let rooms = [];


// CREATE PLOT

function createPlot() {

    let length =
        Number(document.getElementById("plotLength").value);

    let width =
        Number(document.getElementById("plotWidth").value);

    if (length <= 0 || width <= 0) {

        alert("Please enter valid plot dimensions.");

        return;
    }

    let area = length * width;

    document.getElementById("plotArea").innerText = area;

    let floorPlan =
        document.getElementById("floorPlan");

    floorPlan.style.width = "100%";
    floorPlan.style.height = "500px";

    alert("Plot created successfully!");
}


// ADD ROOM

function addRoom() {

    let name =
        document.getElementById("roomName").value;

    let length =
        Number(document.getElementById("roomLength").value);

    let width =
        Number(document.getElementById("roomWidth").value);


    if (length <= 0 || width <= 0) {

        alert("Please enter valid room dimensions.");

        return;
    }


    let area = length * width;


    let room = {

        name: name,

        length: length,

        width: width,

        area: area

    };


    rooms.push(room);

    displayRooms();
}


// DISPLAY ROOMS

function displayRooms() {

    let list =
        document.getElementById("roomList");

    let floorPlan =
        document.getElementById("floorPlan");


    list.innerHTML = "";

    floorPlan.innerHTML = "";


    let totalArea = 0;


    rooms.forEach((room, index) => {

        totalArea += room.area;


        // ROOM LIST

        let item =
            document.createElement("div");

        item.className = "room-item";


        item.innerHTML = `

            <span>

                <strong>${room.name}</strong>

                -
                ${room.length} × ${room.width} ft

                =
                ${room.area} sq.ft

            </span>

            <button
                class="danger"
                onclick="deleteRoom(${index})">

                Delete

            </button>

        `;


        list.appendChild(item);


        // ROOM IN FLOOR PLAN

        let roomBox =
            document.createElement("div");

        roomBox.className = "room";

        roomBox.innerHTML = `

            <strong>${room.name}</strong>
            <br>
            ${room.length} × ${room.width}

        `;


        // Basic visual scaling

        roomBox.style.width =
            Math.max(room.width * 5, 80) + "px";

        roomBox.style.height =
            Math.max(room.length * 5, 60) + "px";


        roomBox.style.left =
            (index % 4) * 150 + 10 + "px";

        roomBox.style.top =
            Math.floor(index / 4) * 130 + 10 + "px";


        floorPlan.appendChild(roomBox);

    });


    document.getElementById("totalArea")
        .innerText = totalArea;

}


// DELETE ROOM

function deleteRoom(index) {

    rooms.splice(index, 1);

    displayRooms();

}


// COST CALCULATION

function calculateCost() {

    let area =
        Number(document.getElementById("totalArea").innerText);

    let rate =
        Number(document.getElementById("costPerSqft").value);


    let cost = area * rate;


    document.getElementById("totalCost")
        .innerText = cost.toLocaleString("en-IN");

}


// MATERIAL ESTIMATION

function calculateMaterials() {

    let area =
        Number(document.getElementById("totalArea").innerText);


    // Approximate values only

    let cement =
        Math.ceil(area * 0.4);

    let bricks =
        Math.ceil(area * 8);

    let sand =
        Math.ceil(area * 0.5);

    let steel =
        Math.ceil(area * 4);


    document.getElementById("cement")
        .innerText = cement;

    document.getElementById("bricks")
        .innerText = bricks;

    document.getElementById("sand")
        .innerText = sand;

    document.getElementById("steel")
        .innerText = steel;

}


// SAVE DESIGN

function saveDesign() {

    localStorage.setItem(
        "houseDesign",
        JSON.stringify(rooms)
    );

    alert("Design saved successfully!");

}


// CLEAR DESIGN

function clearDesign() {

    let confirmDelete =
        confirm("Are you sure you want to clear the design?");


    if (confirmDelete) {

        rooms = [];

        localStorage.removeItem("houseDesign");

        displayRooms();

        document.getElementById("totalArea")
            .innerText = "0";

        document.getElementById("totalCost")
            .innerText = "0";

    }

}