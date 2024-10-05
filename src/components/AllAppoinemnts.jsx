import React, { useState, useEffect } from "react";
import "../styles/AllAppointments.css";

function AllAppointments() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch appointments from the backend when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/api/appoinments/getappointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.appointments) {
          setAppointments(data.appointments);
        } else {
          console.error('No appointments found');
        }
      })
      .catch((error) => console.error('Error fetching appointments:', error));
  }, []);

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleCallNowClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const updateAppointmentStatus = (id, status) => {
    fetch(`http://localhost:5000/api/appoinments/editappointment/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),  // Pass the status in the request body
    })


      .then((response) => response.json())
      .then((data) => {
        if (data.status === "Appointment updated") {
          // Update the appointment's status in the frontend
          const updatedAppointments = appointments.map((appointment) => 
            appointment._id === id ? { ...appointment, status } : appointment
          );
          setAppointments(updatedAppointments);
  
          // Update the selected conversation to show updated status
          setSelectedConversation((prev) => ({ ...prev, status }));
        } else {
          console.error('Failed to update appointment status:', data.message);
        }
      })
      .catch((error) => console.error('Error updating appointment status:', error));
  };
  

  return (
    <div className="appointment-container">
      <div className="conversation-list">
        <div className="tab-buttons">
          <button className="tab active">All</button>
          <button className="tab">Unread</button>
          <button className="tab">Read</button>
        </div>

        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="conversation-item"
            onClick={() => selectConversation(appointment)}
          >
            <div>
              <div className="profile-pic"></div>
            </div>
            <div>
              <div className="conversation-details">
                <h3>{appointment.name}</h3>
                <p>{appointment.textmessage || "No message"}</p>
                <span className="conversation-time">
                  {appointment.date} {appointment.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="conversation-preview">
        {selectedConversation ? (
          <>
            <div className="top-of-frame">
              <div className="top-of-frame-dp">
                <div className="profile-icon"></div>
              </div>
              <div className="top-of-frame-details">
                <h2 style={{ fontWeight: "bold", fontSize: "32px", margin: "0 0 3px 0" }}>
                  {selectedConversation.name}
                </h2>
                <h4 style={{ margin: "0 0 3px 0" }}>
                  {selectedConversation.voicemessage || "No voice message"}
                </h4>
                <p style={{ margin: "0 0 3px 0" }}>
                  {selectedConversation.district}
                </p>
                <button className="call-now-btn" onClick={handleCallNowClick}>
                  Call Now
                </button>
              </div>
            </div>
            <div className="middle-of-frame">
              <div className="chat-container">
                <div className="chat-message-email">
                  Email: {selectedConversation.email || "No text message"}
                </div>
                <div className="chat-message sent">
                  {selectedConversation.textmessage || "No text message"}
                </div>
              </div>
            </div>
            <div className="bottom-of-frame">
              <div className="action-buttons">
                {selectedConversation.status !== "Done" && (
                  <button
                    className="cancel-btn"
                    onClick={() => updateAppointmentStatus(selectedConversation._id, "Cancelled")}
                    style={{ width: selectedConversation.status === "Done" ? "100%" : "45%" }}
                  >
                    Cancel Appointment
                  </button>
                )}
                {selectedConversation.status !== "Cancelled" && (
                  <button
                    className="done-btn"
                    onClick={() => updateAppointmentStatus(selectedConversation._id, "Done")}
                    style={{ width: selectedConversation.status === "Cancelled" ? "100%" : "45%" }}
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <p>Select a conversation to preview</p>
        )}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Call {selectedConversation.name}</h2>
            <p>Phone Number: +123-456-7890</p>
            <button className="close-btn" onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}


export default AllAppointments;