/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";
import './publicPath';
import * as React from "react";
import { createRoot } from 'react-dom/client';
import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;
import FormattingModel = powerbi.visuals.FormattingModel;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import IViewport = powerbi.IViewport;
import MapView from "@arcgis/core/views/MapView.js";
import Map from "@arcgis/core/Map.js";
import Basemap from "@arcgis/core/Basemap.js";
import { ReactCircleCard, initialState } from "./component";
import { Settings } from "./settings";
import "./../style/visual.less";
import { setAssetPath } from "@esri/calcite-components/dist/components";
import MapImageLayer from '@arcgis/core/layers/MapImageLayer.js';

setAssetPath("https://unpkg.com/@esri/calcite-components/dist/calcite/assets");

export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;
    private settings: Settings;
    private viewport: IViewport;
    private formattingSettingsService: FormattingSettingsService;
    private localizationManager: ILocalizationManager;

    constructor(options: VisualConstructorOptions) {
        debugger;
        this.reactRoot = React.createElement(ReactCircleCard, {});
        this.target = options.element;
        this.settings = new Settings()
        this.localizationManager = options.host.createLocalizationManager()
        this.formattingSettingsService = new FormattingSettingsService(this.localizationManager);
        // const root = createRoot(this.target);
        // root.render(this.reactRoot);
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
            container: this.target as HTMLDivElement,
            map: map,
            zoom: 4,
            center: [15, 65] // longitude, latitude
          });
    }

    public update(options: VisualUpdateOptions) {

        if(options.dataViews && options.dataViews[0]){
            const dataView: DataView = options.dataViews[0];
            this.viewport = options.viewport;
            const { width, height } = this.viewport;
            const size = Math.min(width, height);

            this.settings = this.formattingSettingsService.populateFormattingSettingsModel(Settings, options.dataViews);
            const object = this.settings.circle;
            
            ReactCircleCard.update({
                size,
                borderWidth: object?.circleThickness.value ? object.circleThickness.value : undefined,
                background: object?.circleColor.value.value ? object.circleColor.value.value : undefined,
                textLabel: dataView.metadata.columns[0].displayName,
                textValue: dataView.single.value.toString()
            });
        } else {
            this.clear();
        }
    }

    private clear() {
        ReactCircleCard.update(initialState);
    }

    public getFormattingModel(): FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.settings);
    }

}