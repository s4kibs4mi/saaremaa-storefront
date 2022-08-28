import React from "react";

export const Footer = ({ shop }) => (
  <div className="container mt-5">
    <footer className="bg-white border-top p-3 text-muted small">
      <div className="row align-items-center justify-content-between">
        <div>
          <span className="navbar-brand mr-2">
            <strong>{shop.name}</strong>
          </span>
          Copyright &copy; {new Date().getFullYear()} {shop.name}.&nbsp;&nbsp;All rights reserved.
        </div>
        <div>
          Made with&nbsp;
          <a
            target="_blank"
            className="font-weight-bold"
            href="https://shopemaa.com"
            rel="noreferrer">
            Shopemaa
          </a>
        </div>
      </div>
    </footer>
  </div>
);
