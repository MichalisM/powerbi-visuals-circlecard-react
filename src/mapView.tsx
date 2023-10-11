import { useRef, useEffect } from "react";
import * as React from "react";
import MapView from "@arcgis/core/views/MapView.js";
import Map from "@arcgis/core/Map.js";
import Basemap from "@arcgis/core/Basemap.js";
import MapImageLayer from '@arcgis/core/layers/MapImageLayer.js';
import Home from "@arcgis/core/widgets/Home.js";

function reactMapView() {

    const mapDiv = useRef(null);

    useEffect(() => {
        if (mapDiv.current) {
            /**
             * Initialize application
             */
            const baseMapLayer = new MapImageLayer({
                url: "https://tst-gis.infrabel.be/arcgis/rest/services/OpenStreetBasemap/MapServer"
            })
            const basemap = new Basemap({
                id: "osmMap",
                title: "OSM BaseMap"
            });
            basemap.baseLayers.add(baseMapLayer);
            const map = new Map({
                basemap: basemap
            });

            const customMapView = new MapView({
                container: mapDiv.current,
                map: map,
            });
            const homeWidget = new Home({
                view: customMapView
            });

            // adds the home widget to the top left corner of the MapView
            customMapView.ui.add(homeWidget, "top-left");
        }
    }, []);

    return <div className="mapDiv" ref={mapDiv}></div>;
}

export default reactMapView;