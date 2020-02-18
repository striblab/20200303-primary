# Building county maps

1. Create a .geojson of your state counties in QGIS, in unprojected coordinates (raw lat-lng)
2. Convert to topojson, simplify and quantize to reduce file size:

```
geo2topo counties=mn_counties.geojson | toposimplify -S 0.007 --filter-all | topoquantize 1e3 > mn.json
geo2topo roads=mn_interstates.geojson | toposimplify -S 0.1 --filter-all | topoquantize 1e5 > mn_roads.json

geo2topo counties=ia_counties.geojson | toposimplify -S 0.007 --filter-all | topoquantize 1e3 > iowa.json

geo2topo counties=nh_counties.geojson | toposimplify -S 0.1 --filter-all | topoquantize 1e5 > nh.json
geo2topo roads=nh_interstates.geojson | toposimplify -S 0.1 --filter-all | topoquantize 1e5 > nh_roads.json
```
3. We're not currently doing this, but if you did want to reproject before using, tell the JS what projection values to use

geoproject 'd3.geoTransverseMercator().rotate([-134.3333333333333, 0]).center([0, 36]).translate([d.width/2,d.height/2]).fitSize([1500,1500],d)' < geojson_output.json > geojson_transversemercator.json

# svelte app

This is a project template for [Svelte](https://svelte.dev) apps. It lives at https://github.com/sveltejs/template-webpack.

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit sveltejs/template-webpack svelte-app
cd svelte-app
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*


## Get started

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start webpack:

```bash
npm run dev
```

Navigate to [localhost:8080](http://localhost:8080). You should see your app running. Edit a component file in `src`, save it, and the page should reload with your changes.


## Deploying to the web

### With [now](https://zeit.co/now)

Install `now` if you haven't already:

```bash
npm install -g now
```

Then, from within your project folder:

```bash
now
```

As an alternative, use the [Now desktop client](https://zeit.co/download) and simply drag the unzipped project folder to the taskbar icon.

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public
```
