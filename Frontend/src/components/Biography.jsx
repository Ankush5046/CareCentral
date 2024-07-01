import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <p>Biography</p>
          <h3>Who We Are</h3>
          <p>
          Hospital, an institution that is built, staffed, and equipped for the diagnosis of disease; for the treatment, both medical and surgical, of the sick and the injured; and for their housing during this process. The modern hospital also often serves as a centre for investigation and for teaching.
          </p>
          <p>We are all in 2024!</p>
          <p>
          Healthcare is involved, directly or indirectly, with the provision of health services to individuals. These services can occur in a variety of work settings, including hospitals, clinics, dental offices, out-patient surgery centers, birthing centers, emergency medical care, home healthcare, and nursing homes.
          </p>
          <p>We are Care Central !</p>
        </div>
      </div>
    </>
  );
};

export default Biography;