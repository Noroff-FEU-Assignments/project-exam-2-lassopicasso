import React, { useState, useEffect } from "react";
import moment from "moment/moment";

import Header from "../../../common/Header";
import { apiEnquiry } from "../../../constants/api";
import ResponseMessage from "../../../common/ResponseMessage";

function EnquiryCard(props) {
  const [readMore, setReadMore] = useState(false);
  const [read, setRead] = useState(props.enquiry.attributes.read);
  const [responseMessage, setResponseMessage] = useState(null);
  const { hotel, date: bookingDate, name, email, adult, children, room } = props.enquiry.attributes;
  const guests = `${adult} Adult - ${children} Children - ${room} Room`;
  const date = moment(props.enquiry.attributes.publishedAt).format("MMM Do YYYY, h:mm a");
  const price = `${props.enquiry.attributes.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} NOK`;
  const message = props.enquiry.attributes.message.length > 0 ? props.enquiry.attributes.message : "No message";
  const id = props.enquiry.id;
  const api = apiEnquiry + "/" + id;

  useEffect(() => {
    const data = JSON.stringify({
      data: { read: read },
    });
    const options = {
      method: "PUT",
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.user.jwt} `,
      },
    };
    async function updateRead() {
      try {
        const response = await fetch(api, options);
        setReadMore(false);
        if (!response.ok) {
          setResponseMessage({ response: "error", message: `Oh no! The following error occurred: ${response.statusText}` });
        }
      } catch (error) {
        setResponseMessage({ response: "error", message: `Oh no! The following error occurred: ${error}` });
      }
    }
    updateRead();
    // eslint-disable-next-line
  }, [read]);

  if (props.filter === "unread" && read === true) {
    return "";
  }
  if (props.filter === "read" && read === false) {
    return "";
  }

  if (responseMessage) {
    return <ResponseMessage type={responseMessage.response} message={responseMessage.message} />;
  }

  return (
    <div className="messages__card">
      <div className="messages__card--wrapper">
        <div>
          <div>{date}</div>
        </div>
        <Header type="sub" header={hotel} />
        <div>
          <span>Date:</span> {bookingDate}
        </div>
        <div>
          <span>Guests:</span> {guests}
        </div>
        <div>
          <span>Price:</span> {price}
        </div>
        {readMore ? (
          <>
            <div>
              <span>Name:</span> {name}
            </div>
            <div>
              <span>Email:</span> {email}
            </div>
            <div>
              <span>Message:</span> {message}
            </div>
            <div className="messages__buttons">
              <button className="cta" onClick={() => setRead(!read)}>
                {props.filter === "read" ? "Not read" : "Read"}
              </button>
              <button className="cta" onClick={() => setReadMore(false)}>
                Hide
              </button>
            </div>
            <a className="cta" href={`mailto:${email}`}>
              Answer
            </a>
          </>
        ) : (
          <button className="cta" onClick={() => setReadMore(true)}>
            Read message
          </button>
        )}
      </div>
    </div>
  );
}

export default EnquiryCard;
