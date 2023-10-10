import { useRef, useEffect } from "react";
import * as React from "react";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import Basemap from "@arcgis/core/Basemap";
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';

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

            new MapView({
                container: mapDiv.current,
                map: map,
            });
        }
    }, []);

    return <div className="mapDiv" ref={mapDiv}></div>;
}

export default reactMapView;