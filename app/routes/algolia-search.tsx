import { renderToString } from "react-dom/server";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { Hit as AlgoliaHit } from "instantsearch.js";
import type { InstantSearchServerState } from "react-instantsearch-hooks-web";
import instantsearchStyles from "instantsearch.css/themes/satellite-min.css";
import {
  DynamicWidgets,
  Highlight,
  Hits,
  InstantSearch,
  InstantSearchSSRProvider,
  RefinementList,
  SearchBox,
} from "react-instantsearch-hooks-web";
import { getServerState } from "react-instantsearch-hooks-server";
import { history } from "instantsearch.js/cjs/lib/routers/index.js";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Panel } from "~/components/Panel";
import { searchClient } from "~/utils/algoliaSearchClient";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: instantsearchStyles },
];

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl = request.url;
  const serverState = await getServerState(<Search serverUrl={serverUrl} />, {
    renderToString,
  });

  return json({
    serverState,
    serverUrl,
  });
};

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    price: number;
  }>;
};

function Hit({ hit }: HitProps) {
  return (
    <>
      <Highlight hit={hit} attribute="name" className="Hit-label" />
      <span className="Hit-price">${hit.price}</span>
    </>
  );
}

type SearchPageProps = {
  serverState?: InstantSearchServerState;
  serverUrl?: string;
};

function Search({ serverState, serverUrl }: SearchPageProps) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        searchClient={searchClient}
        indexName="instant_search"
        routing={{
          router: history({
            getLocation() {
              if (typeof window === "undefined") {
                return new URL(serverUrl!) as unknown as Location;
              }

              return window.location;
            },
          }),
        }}
      >
        <div className="Container">
          <div className="Sidebar">
            <DynamicWidgets fallbackComponent={FallbackComponent} />
          </div>
          <div className="MainContent">
            <SearchBox />
            <Hits hitComponent={Hit} />
          </div>
        </div>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
}

function FallbackComponent({ attribute }: { attribute: string }) {
  return (
    <Panel header={attribute}>
      <RefinementList attribute={attribute} />
    </Panel>
  );
}

export default function Page() {
  const { serverState, serverUrl } = useLoaderData() as SearchPageProps;

  return <Search serverState={serverState} serverUrl={serverUrl} />;
}
