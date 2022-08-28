import React from "react";
import Link from "next/link";
import { Menu } from "@/core/models/menu";
import { Shop } from "@/core/models/shop";

type Props = {
  menus: Menu[];
  shop: Shop;
};

export const Nav = ({ shop, menus }: Props) => (
  <nav className="topnav navbar navbar-expand-lg navbar-light bg-white fixed-top">
    <div className="container">
      <Link href="/">
        <a href="/" className="navbar-brand">
          <strong>{shop.name}</strong>
        </a>
      </Link>
      <button
        className="navbar-toggler collapsed"
        type="button"
        data-toggle="collapse"
        data-target="#navbarColor02"
        aria-controls="navbarColor02"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
      </button>
      <div className="navbar-collapse collapse" id="navbarColor02">
        <ul className="navbar-nav mr-auto d-flex align-items-center">
          {menus &&
          menus.map((menu: Menu) => {
            return (
              <li key={menu.url} className="nav-item">
                <Link href={menu.url}>
                  <a href={menu.url} className="nav-link">
                    {menu.name}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  </nav>
);
