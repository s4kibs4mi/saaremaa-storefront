import React, { useState } from "react";

export interface AlertMeta {
  class: string;
  message: string;
}

export const Subscription = () => {
  const [email, setEmail] = useState<string>("");
  const [blocked, setBlocked] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertMeta>();

  return (
    <div className="border p-5 bg-lightblue">
      <div className="row justify-content-between">
        <div className="col-md-5 mb-2 mb-md-0">
          <h5 className="font-weight-bold secondfont">Become a member</h5>
          Get the latest news right in your inbox. We never spam!
        </div>
        <div className="col-md-7">
          {alert && (
            <div className={`alert alert-${alert.class}`} role="alert">
              {alert.message}
            </div>
          )}

          <div className="row">
            <div className="col-md-12">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="form-control"
                placeholder="Enter your e-mail address"
                disabled={blocked}
              />
            </div>
            <div className="col-md-12 mt-2">
              <button type="submit" className="btn btn-success btn-block" disabled={blocked}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
