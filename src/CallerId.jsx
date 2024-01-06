import React, { Component } from "react";
import {
  HiPhoneMissedCall,
  HiPhoneOutgoing,
  HiPhoneIncoming,
} from "react-icons/hi";
import "./css/callerId.css";

class CallerId extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCall: null,
    };
  }

  async componentDidMount() {
    try {
      const res = await fetch(
        `https://cerulean-marlin-wig.cyclic.app/activities/${this.props.match.params.id}`
        // `https://cerulean-marlin-wig.cyclic.app/activities/639746e963147b03c894f521`
      );
      const data = await res.json();
      this.setState({ activeCall: data });
      console.log(this.state.activeCall);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  render() {
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
    return this.state.activeCall !== null ? (
      <div className="callerId">
        <span
          className="callCardLogo"
          style={{
            color:
              this.state.activeCall.direction === "outbound"
                ? "green"
                : this.state.activeCall.direction === "inbound"
                ? "orange"
                : "red",
          }}
        >
          {this.state.activeCall.direction === "outbound" && (
            <HiPhoneOutgoing />
          )}
          {this.state.activeCall.direction === "inbound" && <HiPhoneIncoming />}
          {this.state.activeCall.direction === undefined && (
            <HiPhoneMissedCall />
          )}
        </span>
        <h3 className="callingNumberTo">
          {this.state.activeCall.to !== undefined
            ? this.state.activeCall.to
            : "Unknown Number"}
        </h3>
        <h5 className="callingNumberDate">
          {new Date(this.state.activeCall.created_at).toLocaleString()}
        </h5>
        <br />
        <span className="hr"></span>
        <br />
        <div className="extraDetails">
          <p className="from">From: {this.state.activeCall.from}</p>
          <p className="via">Via: {this.state.activeCall.via}</p>
          <p className="duration">
            Duration: {formatDuration(this.state.activeCall.duration)} seconds
          </p>
          <p className="archiveStatus">
            Archived Status:{" "}
            {this.state.activeCall.is_archived ? "Archived" : "Unarchived"}
          </p>
        </div>
      </div>
    ) : (
      <div>Loading...</div>
    );
  }
}

export default CallerId;
