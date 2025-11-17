import carousel from "./carousel";
import flickr from "./flickr";
import foursquare from "./foursquare";
import googleSearch from "./googleSearch";
import hyperlapse from "./hyperlapse";
import inbox from "./inbox";
import instagram from "./instagram";
import lollipop from "./lollipop";
import neubible from "./neubible";
import paper from "./paper";
import path from "./path";
import pinterest from "./pinterest";
import quartz from "./quartz";
import secret from "./secret";
import shorts from "./shorts";
import skype from "./skype";
import soundcloud from "./soundcloud";
import squareOrder from "./squareOrder";
import stripeDashboard from "./stripeDashboard";
import sunrise from "./sunrise";
import tumblr from "./tumblr";
import twitter from "./twitter";

export type AppDissectionItemType = {
  slug: string;
  title: string;
  description: string;
  createdAt: string;
  details: Array<AppDissectionItemDetailType>;
  tint: string;
};

export type AppDissectionItemDetailType = {
  title: string;
  description: string;
  media: Array<string> | null;
  orientation?: "landscape";
};

export const allAppDissectionItems: AppDissectionItemType[] = [
  twitter,
  paper,
  secret,
  googleSearch,
  sunrise,
  flickr,
  skype,
  path,
  soundcloud,
  foursquare,
  pinterest,
  hyperlapse,
  inbox,
  squareOrder,
  lollipop,
  instagram,
  tumblr,
  carousel,
  quartz,
  stripeDashboard,
  shorts,
  neubible,
].reverse();
