import React, { useState, useEffect } from "react";
import moment from "moment/moment";
import Header from "../../../common/Header";
import { apiContact } from "../../../constants/api";
import ResponseMessage from "../../../common/ResponseMessage";

function ContactCard(props) {
  const [readMore, setReadMore] = useState(false);
  const [read, setRead] = useState(props.contact.attributes.read);
  const [responseMessage, setResponseMessage] = useState(null);

  const date = moment(props.contact.attributes.publishedAt).format("MMM Do YYYY, h:mm a");
  const { subject, name, email, message } = props.contact.attributes;
  const id = props.contact.id;
  const api = apiContact + "/" + id;

  //Update the API that this message is read.
  useEffect(() => {
    async function updateRead() {
      let data = JSON.stringify({
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

  //If the user/admin has clicked on only display "not read" messages, and the card is "read" dont display it. Next statement similar.
  if (props.filter === "unread" && read === true) {
    return "";
  }
  if (props.filter === "read" && read === false) {
    return "";
  }
  //If the query of the card failed, display error message.
  if (responseMessage) {
    return <ResponseMessage type={responseMessage.response} message={responseMessage.message} />;
  }

  return (
    <div className="messages__card">
      <div className="messages__card--wrapper">
        <div>
          <div>{date}</div>
        </div>
        <Header type="sub" header={subject} />
        <div>
          <span>Name:</span> {name}
        </div>
        <div>
          <span>Email:</span> {email}
        </div>
        {readMore ? (
          <>
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

export default ContactCard;
