import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "@/core/models/menu";
import { Shop } from "@/core/models/shop";
import { Shopemaa } from "@/core/shopemaa";

type Props = {
  menus: Menu[];
  shop: Shop;
};

export const Nav = ({ shop, menus }: Props) => {
  const [navOpen, setNavOpen] = useState(false);
  const [hideLogin, setHideLogin] = useState(false);

  useEffect(() => {
    Shopemaa.Api().customerProfile().then(res => {
      if (res.data.data !== null) {
        setHideLogin(true);
      }
    });
  });

  return (
    <nav className="topnav navbar navbar-expand-lg navbar-light bg-white fixed-top">
      <div className="container">
        <Link href="/">
          <a href="/" className="navbar-brand">
            <strong>{shop.name}</strong>
          </a>
        </Link>
        <button
          onClick={() => setNavOpen(!navOpen)}
          className={navOpen ? "navbar-toggler" : "navbar-toggler collapsed"}
          type="button"
          data-toggle="collapse"
          data-target="#navbarColor02"
          aria-controls="navbarColor02"
          aria-expanded={navOpen ? "true" : "false"}
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className={navOpen ? "navbar-collapse collapse show" : "navbar-collapse collapse"} id="navbarColor02">
          <ul className="navbar-nav mr-auto d-flex align-items-center">
            {menus &&
            menus.map((menu: Menu) => {
              return (
                <li key={menu.url} className="nav-item">
                  <Link href={menu.url}>
                    <a onClick={() => setNavOpen(false)} href={menu.url} className="nav-link">
                      {menu.name}
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>

          <ul className="navbar-nav ml-auto d-flex align-items-center">
            <li className="nav-item highlight">
              {hideLogin && (
                <Link href={"/my-account"}>
                  <a className="nav-link"
                     onClick={() => setNavOpen(false)}
                     href={"/my-account"}>
                    My Account
                  </a>
                </Link>
              )}
              {!hideLogin && (
                <Link href={"/login"}>
                  <a className="nav-link"
                     onClick={() => setNavOpen(false)}
                     href={"/login"}>
                    Login
                  </a>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
