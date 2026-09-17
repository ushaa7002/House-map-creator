
let rooms = [];

let plot = {
    length: 0,
    width: 0,
    area: 0
};

function logout() {

    sessionStorage.removeItem("isLoggedIn");

    window.location.href = "login.html";
}
function createPlot() {

    let length =
        Number(document.getElementById("plotLength").value);

    let width =
        Number(document.getElementById("plotWidth").value);


    if (length <= 0 || width <= 0) {

        alert("Please enter valid plot dimensions.");

        return;
    }


    plot.length = length;
    plot.width = width;
    plot.area = length * width;


    document.getElementById("plotArea")
        .innerText = plot.area;


    displayRooms();

    alert("Plot created successfully!");
}


function addRoom() {

    if (plot.length === 0 || plot.width === 0) {

        alert("Please create the plot first.");

        return;
    }


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
    let currentArea = rooms.reduce(
        (total, room) => total + room.area,
        0
    );


    if (currentArea + area > plot.area) {

        alert(
            "Room cannot be added because total room area exceeds plot area!"
        );

        return;
    }


    rooms.push(room);

    document.getElementById("roomLength").value = "";
    document.getElementById("roomWidth").value = "";


    displayRooms();
}

function displayRooms() {

    let list =
        document.getElementById("roomList");


    list.innerHTML = "";


    let totalArea = 0;


    rooms.forEach((room, index) => {

        totalArea += room.area;


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

    });


    if (rooms.length === 0) {

        list.innerHTML =
            "<p>No rooms added yet.</p>";

    }


    document.getElementById("totalArea")
        .innerText = totalArea;


    // Generate proper floor plan

    generateFloorPlan();
}


// ===============================
// GENERATE FLOOR PLAN
// ===============================

function generateFloorPlan() {

    let floorPlan =
        document.getElementById("floorPlan");


    floorPlan.innerHTML = "";


    // Check plot

    if (plot.length === 0 || plot.width === 0) {

        floorPlan.innerHTML = `

            <p class="empty-message">
                Create a plot first.
            </p>

        `;

        return;
    }


    // Check rooms

    if (rooms.length === 0) {

        floorPlan.innerHTML = `

            <p class="empty-message">
                Add rooms to generate the floor plan.
            </p>

        `;

        return;
    }


    // Maximum display size

    let maxWidth = 900;
    let maxHeight = 600;


    // Scale plot to screen

    let scaleX =
        maxWidth / plot.length;

    let scaleY =
        maxHeight / plot.width;


    let scale =
        Math.min(scaleX, scaleY);


    // Prevent extremely large rooms

    scale =
        Math.min(scale, 25);


    let plotPixelWidth =
        plot.length * scale;

    let plotPixelHeight =
        plot.width * scale;


    // Create actual house boundary

    let house =
        document.createElement("div");

    house.className = "house-boundary";


    house.style.width =
        plotPixelWidth + "px";

    house.style.height =
        plotPixelHeight + "px";


    house.style.position = "relative";


    // Plot label

    let plotLabel =
        document.createElement("div");

    plotLabel.className = "plot-label";

    plotLabel.innerText =
        `Plot: ${plot.length} × ${plot.width} ft`;


    house.appendChild(plotLabel);


    // Store placed rooms

    let placedRooms = [];


    // Sort large rooms first
    // This gives better automatic packing

    let roomsToPlace =
        [...rooms].sort(
            (a, b) => b.area - a.area
        );


    // Place every room

    for (let room of roomsToPlace) {


        let roomPixelWidth =
            room.length * scale;

        let roomPixelHeight =
            room.width * scale;


        let position =
            findBestPosition(
                roomPixelWidth,
                roomPixelHeight,
                placedRooms,
                plotPixelWidth,
                plotPixelHeight
            );


        // If room doesn't fit

        if (position === null) {

            floorPlan.innerHTML = `

                <div class="error-message">

                    <h3>⚠️ Rooms cannot fit properly!</h3>

                    <p>
                        Try increasing plot size or reducing
                        room dimensions.
                    </p>

                </div>

            `;

            return;
        }


        // Create room box

        let roomBox =
            document.createElement("div");


        roomBox.className = "room";


        roomBox.style.width =
            roomPixelWidth + "px";

        roomBox.style.height =
            roomPixelHeight + "px";


        roomBox.style.left =
            position.x + "px";

        roomBox.style.top =
            position.y + "px";


        roomBox.innerHTML = `

            <strong>${room.name}</strong>

            <span>
                ${room.length} × ${room.width} ft
            </span>

            <small>
                ${room.area} sq.ft
            </small>

        `;


        house.appendChild(roomBox);


        // Save room position

        placedRooms.push({

            x: position.x,
            y: position.y,
            width: roomPixelWidth,
            height: roomPixelHeight

        });

    }


    floorPlan.appendChild(house);
}


// ===============================
// FIND BEST ROOM POSITION
// ===============================

function findBestPosition(

    width,
    height,
    placedRooms,
    plotWidth,
    plotHeight

) {


    // First room starts at top-left

    if (placedRooms.length === 0) {

        if (
            width <= plotWidth &&
            height <= plotHeight
        ) {

            return {
                x: 0,
                y: 0
            };

        }

        return null;
    }


    let candidates = [];


    // Try top-left

    candidates.push({
        x: 0,
        y: 0
    });


    // Generate candidate positions
    // beside and below existing rooms

    placedRooms.forEach(room => {

        candidates.push({

            x: room.x + room.width,
            y: room.y

        });


        candidates.push({

            x: room.x,
            y: room.y + room.height

        });

    });


    // Sort candidates from top to bottom

    candidates.sort((a, b) => {

        if (a.y === b.y) {

            return a.x - b.x;

        }

        return a.y - b.y;

    });


    // Check every candidate

    for (let candidate of candidates) {

        let x = candidate.x;
        let y = candidate.y;


        // Boundary check

        if (
            x + width > plotWidth ||
            y + height > plotHeight
        ) {

            continue;
        }


        let overlaps = false;


        // Check overlap

        for (let placed of placedRooms) {

            if (

                x < placed.x + placed.width &&

                x + width > placed.x &&

                y < placed.y + placed.height &&

                y + height > placed.y

            ) {

                overlaps = true;

                break;
            }

        }


        if (!overlaps) {

            return {
                x: x,
                y: y
            };

        }

    }


    return null;
}


// ===============================
// DELETE ROOM
// ===============================

function deleteRoom(index) {

    rooms.splice(index, 1);

    displayRooms();
}


// ===============================
// COST CALCULATION
// ===============================

function calculateCost() {

    let area =
        Number(
            document.getElementById("totalArea").innerText
        );


    let rate =
        Number(
            document.getElementById("costPerSqft").value
        );


    let cost =
        area * rate;


    document.getElementById("totalCost")
        .innerText =
        cost.toLocaleString("en-IN");

}


// ===============================
// MATERIAL ESTIMATION
// ===============================

function calculateMaterials() {

    let area =
        Number(
            document.getElementById("totalArea").innerText
        );


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



function saveDesign() {

    let design = {

        plot: plot,

        rooms: rooms,

        savedAt:
            new Date().toLocaleString()

    };


    localStorage.setItem(
        "houseDesign",
        JSON.stringify(design)
    );


    alert(
        "Design saved successfully!"
    );

}


// ===============================
// CLEAR DESIGN
// ===============================

function clearDesign() {

    let confirmDelete =
        confirm(
            "Are you sure you want to clear the design?"
        );


    if (confirmDelete) {

        rooms = [];


        plot = {

            length: 0,
            width: 0,
            area: 0

        };


        localStorage.removeItem(
            "houseDesign"
        );


        document.getElementById("plotLength").value = "";

        document.getElementById("plotWidth").value = "";


        document.getElementById("plotArea")
            .innerText = "0";


        document.getElementById("totalArea")
            .innerText = "0";


        document.getElementById("totalCost")
            .innerText = "0";


        displayRooms();

    }

}
