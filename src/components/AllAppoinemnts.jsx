import React, { useState } from "react";
import "../styles/AllAppointments.css";

function AllAppointments() {
      const [selectedConversation, setSelectedConversation] = useState(null);

      const conversations = [
            {
                  id: 1,
                  name: "Niduka Konara",
                  title: "What is want update",
                  time: "01-02-24 14:22",
                  preview: "Illustrations and graphic elements from the world's best designers. Want more inspiration? Browse our search results.",
                  location: "Malabe North",
                  description: "Tea Industry Copes With Fungal Diseases",
            },
            // Add more conversations here
      ];

      const selectConversation = (conversation) => {
            setSelectedConversation(conversation);
      };

      return (
            <div className="appointment-container">
                  <div className="conversation-list">
                        <div className="tab-buttons">
                              <button className="tab active">All</button>
                              <button className="tab">Unread</button>
                              <button className="tab">Read</button>
                        </div>
                        {conversations.map((conversation) => (
                              <div
                                    key={conversation.id}
                                    className="conversation-item"
                                    onClick={() =>
                                          selectConversation(conversation)
                                    }
                              >
                                    <div>
                                          <div className="profile-pic"></div>
                                    </div>
                                    <div>
                                          <div className="conversation-details">
                                                <h3>{conversation.title}</h3>
                                                <p>{conversation.preview}</p>
                                                <span className="conversation-time">
                                                      {conversation.time}
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
                                                <h2 style={{fontWeight:"bold", fontSize:"32px",margin:"0 0 3px 0" }}>
                                                      {
                                                            selectedConversation.name
                                                      }
                                                </h2>
                                                <h4 style={{margin:"0 0 3px 0"}}>
                                                      {
                                                            selectedConversation.description
                                                      }
                                                </h4>
                                                <p style={{margin:"0 0 3px 0"}}>
                                                      {
                                                            selectedConversation.location
                                                      }
                                                </p>
                                                <button className="call-now-btn">
                                                      Call Now
                                                </button>
                                          </div>
                                    </div>
                                    <div className="middle-of-frame">
                                          <div>Chat</div>
                                    </div>
                                    <div className="bottom-of-frame">
                                          <div className="action-buttons">
                                                <button className="cancel-btn">
                                                      Cancel Appointment
                                                </button>
                                                <button className="done-btn">
                                                      Done
                                                </button>
                                          </div>
                                    </div>
                              </>
                        ) : (
                              <p>Select a conversation to preview</p>
                        )}
                  </div>
            </div>
      );
}

export default AllAppointments;