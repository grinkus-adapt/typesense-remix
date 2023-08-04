import { cssBundleHref } from "@remix-run/css-bundle";
import styles from "~/styles/global.css";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Home Page (no search)</NavLink>
            </li>
            <li>
              <NavLink to="/algolia-search">Algolia Search</NavLink>
            </li>
            <li>
              <NavLink to="/typesense-search">
                Typesense Search (via adapter)
              </NavLink>
            </li>
          </ul>
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
