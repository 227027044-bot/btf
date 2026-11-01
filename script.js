// ============================================
 // TRAVELEASE - COMMON JAVASCRIPT
 // COMPLETE UPDATED VERSION
 // ============================================


// ============================================
// 1. COMMON FUNCTIONS
// ============================================

function getElement(id) {
    return document.getElementById(id);
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function readData(key) {
    const data = localStorage.getItem(key);

    if (data) {
        return JSON.parse(data);
    }

    return null;
}

function getValue(id) {
    const element = getElement(id);
    return element ? element.value.trim() : "";
}


// ============================================
// 2. HOME PAGE - TRANSPORT SELECTION
// ============================================

const modeButtons = document.querySelectorAll(".mode-btn");

let selectedMode = localStorage.getItem("transportMode") || "Bus";

modeButtons.forEach(function(button) {

    if (button.dataset.mode === selectedMode) {
        button.classList.add("active");
    }

    button.addEventListener("click", function() {

        modeButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        selectedMode = button.dataset.mode;

        localStorage.setItem("transportMode", selectedMode);

    });

});


// ============================================
// 3. SEARCH FORM
// ============================================

const searchForm = getElement("searchForm");

if (searchForm) {

    searchForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const source = getValue("source");
        const destination = getValue("destination");
        const journeyDate = getValue("journeyDate");

        if (!source || !destination || !journeyDate) {
            alert("Please fill all travel details!");
            return;
        }

        if (source.toLowerCase() === destination.toLowerCase()) {
            alert("Source and destination cannot be the same!");
            return;
        }

        const searchDetails = {
            source: source,
            destination: destination,
            journeyDate: journeyDate,
            transportMode: selectedMode
        };

        saveData("travelSearch", searchDetails);

        localStorage.setItem("source", source);
        localStorage.setItem("destination", destination);
        localStorage.setItem("journeyDate", journeyDate);

        window.location.href = "results.html";

    });

}


// ============================================
// 4. REGISTER PAGE
// ============================================

const registerForm = getElement("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const fullName = getValue("fullName");
        const email = getValue("email");
        const phone = getValue("phone");
        const password = getValue("password");
        const confirmPassword = getValue("confirmPassword");

        if (!fullName || !email || !phone || !password || !confirmPassword) {
            alert("Please fill all fields!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            alert("Password must contain at least 6 characters!");
            return;
        }

        let users = readData("travelUsers") || [];

        const existingUser = users.find(function(user) {
            return user.email === email;
        });

        if (existingUser) {
            alert("Email already registered!");
            return;
        }

        const newUser = {
            fullName: fullName,
            email: email,
            phone: phone,
            password: password
        };

        users.push(newUser);

        saveData("travelUsers", users);

        alert("Account created successfully!");

        window.location.href = "login.html";

    });

}


// ============================================
// 5. LOGIN PAGE
// ============================================

const loginForm = getElement("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = getValue("loginEmail");
        const password = getValue("loginPassword");

        if (!email || !password) {
            alert("Please enter email and password!");
            return;
        }

        const users = readData("travelUsers") || [];

        const user = users.find(function(item) {

            return item.email === email &&
                   item.password === password;

        });

        if (user) {

            saveData("loggedInUser", user);

            alert("Login successful!");

            window.location.href = "index.html";

        } else {

            alert("Invalid email or password!");

        }

    });

}


// ============================================
// 6. TRANSPORT DETAILS PAGE
// ============================================

// Get Transport Details from Results Page

const savedTransportName =
    localStorage.getItem("selectedTransportName");

let selectedTransport = null;

if (savedTransportName) {

    selectedTransport = {

        name: savedTransportName,

        type: localStorage.getItem("selectedTransportType"),

        fare: Number(localStorage.getItem("selectedFare")),

        time: localStorage.getItem("selectedTime")

    };

    // Save complete transport details

    saveData("selectedTransport", selectedTransport);

} else {

    selectedTransport = readData("selectedTransport");

}

const searchDetails = readData("travelSearch");

const transportName = getElement("transportName");
const transportType = getElement("transportType");
const detailSource = getElement("detailSource");
const detailDestination = getElement("detailDestination");
const detailFare = getElement("detailFare");

if (selectedTransport) {

    if (transportName) {
        transportName.textContent = selectedTransport.name || "";
    }

    if (transportType) {
        transportType.textContent = selectedTransport.type || "";
    }

    if (detailSource && searchDetails) {
        detailSource.textContent = searchDetails.source;
    }

    if (detailDestination && searchDetails) {
        detailDestination.textContent = searchDetails.destination;
    }

    if (detailFare) {
        detailFare.textContent = "₹" + selectedTransport.fare;
    }

}


// ============================================
// 7. SEAT SELECTION PAGE
// ============================================

const seatLayout = getElement("seatLayout");

let selectedSeats = [];

const seatTotal = getElement("seatTotal");

const selectedSeatsDisplay = getElement("selectedSeats");

// Default Booked Seats

const bookedSeats = [
    "A2", "B3", "C1",
    "D4", "E2", "F3"
];

// Default Waiting List Seats

const waitingSeats = [
    "A4", "C4", "E4"
];

// Get Correct Ticket Fare

const farePerSeat = Number(
    selectedTransport && selectedTransport.fare
) || 0;


if (seatLayout) {

    const seatButtons = seatLayout.querySelectorAll(".seat-btn");

    seatButtons.forEach(function(seat) {

        const seatNumber = seat.dataset.seat;

        // BOOKED SEATS

        if (bookedSeats.includes(seatNumber)) {

            seat.classList.add("booked");

            seat.disabled = true;

        }

        // WAITING LIST SEATS

        else if (waitingSeats.includes(seatNumber)) {

            seat.classList.add("waiting");

            seat.disabled = true;

        }

        // AVAILABLE SEATS

        else {

            seat.addEventListener("click", function() {

                // REMOVE SELECTED SEAT

                if (seat.classList.contains("selected")) {

                    seat.classList.remove("selected");

                    selectedSeats = selectedSeats.filter(
                        function(item) {
                            return item !== seatNumber;
                        }
                    );

                }

                // SELECT AVAILABLE SEAT

                else {

                    if (selectedSeats.length >= 6) {

                        alert("You can select maximum 6 seats!");

                        return;

                    }

                    seat.classList.add("selected");

                    selectedSeats.push(seatNumber);

                }

                // DISPLAY SELECTED SEATS

                if (selectedSeatsDisplay) {

                    selectedSeatsDisplay.textContent =
                        selectedSeats.length > 0
                        ? selectedSeats.join(", ")
                        : "None";

                }

                // CALCULATE TOTAL AMOUNT

                if (seatTotal) {

                    const totalAmount =
                        selectedSeats.length * farePerSeat;

                    seatTotal.textContent = totalAmount;

                }

            });

        }

    });

}


// ============================================
// 8. CONTINUE TO PASSENGER PAGE
// ============================================

const continueSeatButton = getElement("continueBooking");

if (continueSeatButton) {

    continueSeatButton.addEventListener("click", function() {

        if (selectedSeats.length === 0) {

            alert("Please select at least one seat!");

            return;

        }

        // Save Selected Seats

        saveData("selectedSeats", selectedSeats);

        // Save Total Amount

        const totalAmount =
            selectedSeats.length * farePerSeat;

        saveData("totalAmount", totalAmount);

        // Go to Passenger Page

        window.location.href = "passenger.html";

    });

}


// ============================================
// 9. PASSENGER DETAILS PAGE
// ============================================

const passengerForm = getElement("passengerForm");

if (passengerForm) {

    passengerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const passengerName = getValue("passengerName");
        const passengerAge = getValue("passengerAge");
        const passengerGender = getValue("passengerGender");
        const passengerPhone = getValue("passengerPhone");
        const passengerEmail = getValue("passengerEmail");

        if (
            !passengerName ||
            !passengerAge ||
            !passengerGender ||
            !passengerPhone ||
            !passengerEmail
        ) {

            alert("Please fill all passenger details!");

            return;

        }

        const passengerDetails = {

            name: passengerName,

            age: passengerAge,

            gender: passengerGender,

            phone: passengerPhone,

            email: passengerEmail

        };

        saveData("passengerDetails", passengerDetails);

        window.location.href = "payment.html";

    });

}


// ============================================
// 10. PAYMENT PAGE
// ============================================

const paymentForm = getElement("paymentForm");

if (paymentForm) {

    paymentForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const paymentMethod = getValue("paymentMethod");

        const paymentReference = getValue("paymentReference");

        if (!paymentMethod || !paymentReference) {

            alert("Please complete payment details!");

            return;

        }

        const booking = {

            bookingId: "TRV" + Date.now(),

            search: readData("travelSearch"),

            transport: readData("selectedTransport"),

            seats: readData("selectedSeats"),

            passenger: readData("passengerDetails"),

            paymentMethod: paymentMethod,

            paymentReference: paymentReference,

            bookingDate: new Date().toLocaleDateString(),

            status: "Confirmed"

        };

        const bookings = readData("travelBookings") || [];

        bookings.push(booking);

        saveData("travelBookings", bookings);

        saveData("currentBooking", booking);

        alert("Payment successful! Booking confirmed.");

        window.location.href = "confirmation.html";

    });

}


// ============================================
// 11. CONFIRMATION PAGE
// ============================================

const bookingId = getElement("bookingId");

const confirmPassenger = getElement("confirmPassenger");

const confirmSource = getElement("confirmSource");

const confirmDestination = getElement("confirmDestination");

const confirmDate = getElement("confirmDate");

const confirmSeats = getElement("confirmSeats");

const confirmAmount = getElement("confirmAmount");

const currentBooking = readData("currentBooking");

if (currentBooking) {

    if (bookingId) {
        bookingId.textContent = currentBooking.bookingId;
    }

    if (confirmPassenger && currentBooking.passenger) {
        confirmPassenger.textContent = currentBooking.passenger.name;
    }

    if (confirmSource && currentBooking.search) {
        confirmSource.textContent = currentBooking.search.source;
    }

    if (confirmDestination && currentBooking.search) {
        confirmDestination.textContent = currentBooking.search.destination;
    }

    if (confirmDate && currentBooking.search) {
        confirmDate.textContent = currentBooking.search.journeyDate;
    }

    if (confirmSeats && currentBooking.seats) {
        confirmSeats.textContent = currentBooking.seats.join(", ");
    }

    if (confirmAmount && currentBooking.transport) {

        const totalAmount =
            Number(currentBooking.transport.fare) *
            currentBooking.seats.length;

        confirmAmount.textContent = "₹" + totalAmount;

    }

}


// ============================================
// 12. MY BOOKINGS PAGE
// ============================================

const bookingTable = getElement("bookingTable");

if (bookingTable) {

    const bookings = readData("travelBookings") || [];

    if (bookings.length === 0) {

        bookingTable.innerHTML = `
            <tr>
                <td colspan="7">No bookings found!</td>
            </tr>
        `;

    } else {

        bookingTable.innerHTML = "";

        bookings.forEach(function(booking) {

            const row = document.createElement("tr");

            const source = booking.search
                ? booking.search.source
                : "";

            const destination = booking.search
                ? booking.search.destination
                : "";

            const date = booking.search
                ? booking.search.journeyDate
                : "";

            const seats = booking.seats
                ? booking.seats.join(", ")
                : "";

            const fare = booking.transport
                ? Number(booking.transport.fare) *
                  (booking.seats ? booking.seats.length : 0)
                : 0;

            row.innerHTML = `
                <td>${booking.bookingId}</td>
                <td>${source}</td>
                <td>${destination}</td>
                <td>${date}</td>
                <td>${seats}</td>
                <td>₹${fare}</td>
                <td>${booking.status}</td>
            `;

            bookingTable.appendChild(row);

        });

    }

}


// ============================================
// 13. PROFILE PAGE
// ============================================

const profileForm = getElement("profileForm");

const loggedInUser = readData("loggedInUser");

if (loggedInUser) {

    if (getElement("profileName")) {
        getElement("profileName").value =
            loggedInUser.fullName || "";
    }

    if (getElement("profileEmail")) {
        getElement("profileEmail").value =
            loggedInUser.email || "";
    }

    if (getElement("profilePhone")) {
        getElement("profilePhone").value =
            loggedInUser.phone || "";
    }

}

if (profileForm) {

    profileForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const profileName = getValue("profileName");

        const profileEmail = getValue("profileEmail");

        const profilePhone = getValue("profilePhone");

        if (!profileName || !profileEmail || !profilePhone) {

            alert("Please fill all profile details!");

            return;

        }

        let users = readData("travelUsers") || [];

        const userIndex = users.findIndex(function(user) {
            return user.email === profileEmail;
        });

        if (userIndex !== -1) {

            users[userIndex].fullName = profileName;

            users[userIndex].phone = profilePhone;

            saveData("travelUsers", users);

            saveData("loggedInUser", users[userIndex]);

            alert("Profile updated successfully!");

        } else {

            alert("User not found!");

        }

    });

}


// ============================================
// 14. LOGOUT
// ============================================

const logoutButton = getElement("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", function() {

        localStorage.removeItem("loggedInUser");

        alert("Logged out successfully!");

        window.location.href = "login.html";

    });

}


// ============================================
// TRAVELEASE JAVASCRIPT COMPLETED
// ============================================