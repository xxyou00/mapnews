export class MapManager {
    constructor(containerId, location, layers) {
        this.map = null;
        this.markers = new Map();
        this.polygons = new Map();
        this.init(containerId, location, layers);
    }

    async init(containerId, location, layers) {
        await ymaps3.ready;
        const { YMap, YMapFeature, YMapMarker } = ymaps3;
        this.map = new YMap(
            document.getElementById(containerId),
            { location, showScaleInCopyrights: true },
            layers
        );
        
        this.YMapFeature = YMapFeature;
        this.YMapMarker = YMapMarker;
    }

    addCity(cityData, onCityClick) {
        this.addPolygon(cityData, onCityClick);
        this.addMarker(cityData, onCityClick);
    }

    addPolygon(cityData, onClick) {
        const polygon = new this.YMapFeature({
            geometry: {
                type: 'Polygon',
                coordinates: [cityData.coordinates]
            },
            id: cityData._id,
            style: window.POLYGON_STYLE,
            properties: { _id: cityData._id },
            onClick: () => onClick(cityData._id, 'polygon')
        });

        this.polygons.set(cityData._id, polygon);
        this.map.addChild(polygon);
    }

    addMarker(cityData, onClick) {
        const markerElement = this.createMarkerElement(cityData);
        
        const marker = new this.YMapMarker({
            coordinates: cityData.center,
            onClick: () => onClick(cityData._id, 'marker')
        }, markerElement);

        this.markers.set(cityData._id, marker);
        this.map.addChild(marker);
    }

    createMarkerElement(cityData) {
        const divMarker = document.createElement('div');
        divMarker.classList.add('marker');
        divMarker.id = `marker_${cityData._id}`;

        const imgMarker = document.createElement('img');
        imgMarker.src = cityData.imageUrl;
        imgMarker.classList.add('marker-img');
        divMarker.appendChild(imgMarker);

        const nameMarker = document.createElement('p');
        nameMarker.innerText = cityData.name;
        nameMarker.classList.add('marker-text');
        divMarker.appendChild(nameMarker);

        return divMarker;
    }

    updatePolygonStyle(cityId, isActive) {
        const polygon = this.polygons.get(cityId);
        if (polygon) {
            polygon.update({
                style: isActive ? window.POLYGON_STYLE_ACTIVE : window.POLYGON_STYLE
            });
        }
    }
}