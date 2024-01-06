import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  HiPhoneMissedCall,
  HiPhoneOutgoing,
  HiPhoneIncoming,
} from "react-icons/hi";
import { MdArchive, MdUnarchive } from "react-icons/md";
import "./css/content.css";
import "core-js/stable";
import "regenerator-runtime/runtime";

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCalls: [],
      activeTab: "recent",
    };
  }

  async fetchAndSetData() {
    try {
      const res = await fetch(
        "https://cerulean-marlin-wig.cyclic.app/activities"
      );
      const data = await res.json();
      const filteredCalls =
        this.state.activeTab === "recent"
          ? data.filter((e) => e.is_archived === false)
          : data.filter((e) => e.is_archived === true);
      this.setState({ allCalls: filteredCalls });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async componentDidMount() {
    await this.fetchAndSetData();
  }

  async componentDidUpdate(prevProps, prevState) {
    const { activeTab } = this.state;
    if (activeTab !== prevState.activeTab) {
      await this.fetchAndSetData();
    }
  }

  render() {
    const { allCalls } = this.state;
    console.log(allCalls);

    const formatDuration = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const formattedSeconds =
        remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    const handleArchive = async (id, shouldArchive) => {
      try {
        const res = await fetch(
          `https://cerulean-marlin-wig.cyclic.app/activities/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              is_archived: shouldArchive,
            }),
          }
        );
        if (res.ok) {
          // Manually refresh the list after archiving/unarchiving
          this.fetchAndSetData();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    return (
      <div className="content">
        <div className="content-header">
          <ul>
            <li
              className={this.state.activeTab === "recent" ? "active" : ""}
              onClick={() => this.setState({ activeTab: "recent" })}
            >
              Recent Calls
            </li>
            <li
              className={this.state.activeTab === "archived" ? "active" : ""}
              onClick={() => this.setState({ activeTab: "archived" })}
            >
              Archived Calls
            </li>
          </ul>
        </div>
        <div className="calls-list">
          {allCalls.map((call) => (
            <div className="callCard" key={call.id}>
              <Link
                to={`/${call.id}`}
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <div className="callCardDetails">
                  <span
                    className="callCardLogo"
                    style={{
                      color:
                        call.direction === "outbound"
                          ? "green"
                          : call.direction === "inbound"
                          ? "orange"
                          : "red",
                    }}
                  >
                    {call.direction === "outbound" && <HiPhoneOutgoing />}
                    {call.direction === "inbound" && <HiPhoneIncoming />}
                    {call.direction === undefined && <HiPhoneMissedCall />}
                  </span>
                  <span
                    className={`callNumberCard ${
                      call.call_type === "missed" && "missed"
                    }`}
                  >
                    <h5>{call.to !== undefined ? call.to : "Unknown"}</h5>
                    <h6>{new Date(call.created_at).toLocaleString()}</h6>
                  </span>
                </div>
              </Link>
              <span className="callNumberDate">
                {formatDuration(call.duration)}
              </span>
              <span
                className="archiveIcon"
                onClick={() =>
                  handleArchive(
                    call.id,
                    this.state.activeTab === "archived" ? false : true
                  )
                }
                style={{
                  background:
                    this.state.activeTab === "archived" ? "red" : "darkgreen",
                }}
              >
                {this.state.activeTab === "archived" ? (
                  <MdUnarchive />
                ) : (
                  <MdArchive />
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Content;
