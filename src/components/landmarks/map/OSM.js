import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import "./OSM.css";

import resturantIcon from "../../images/spoon-and-fork.png";
import hotelIcon from "../../images/sleeping.png";
import museumIcon from "../../images/museum.png";
import artworkIcon from "../../images/sculpture.png";
import galleryIcon from "../../images/painting.png";
import theatreIcon from "../../images/theater.png";
import defaultIcon from "../../images/default.png";

const OSM = ({ locationCoordinates, landmarks, onMapChange }) => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    const map = mapRef.current;

    if (map) {
      const handleMapChange = () => {
        const bounds = map.getBounds();
        onMapChange(bounds);
      };

      map.on("moveend", handleMapChange);
      map.on("zoomend", handleMapChange);

      return () => {
        map.off("moveend", handleMapChange);
        map.off("zoomend", handleMapChange);
      };
    } else {
      setMapInitialized(false);
    }
  }, [mapRef.current, onMapChange, locationCoordinates]);

  useEffect(() => {
    if (!mapInitialized) {
      setMapInitialized(true);
    }
  }, [mapInitialized]);

  const handlePopupClick = (landmark) => {
    navigate(`/homeinfor/${landmark._id}`, { state: { landmark } });
  };

  const getIconForType = (type) => {
    switch (type) {
      case "restaurant":
        return L.divIcon({
          className: "custom-icon restaurant-icon",
          html: `<div class="icon-wrapper">
             <img src="${resturantIcon}"/>
           </div>`,
          iconSize: [25, 25],
          iconAnchor: [12, 25],
          popupAnchor: [0, -25],
        });
      case "hotel":
      case "guest_house":
        return L.divIcon({
          className: "custom-icon hotel-icon",
          html: `<div class="icon-wrapper">
             <img src="${hotelIcon}"/>
           </div>`,
          iconSize: [25, 25],
          iconAnchor: [12, 25],
          popupAnchor: [0, -25],
        });
      case "theatre":
      case "theater":
        return L.divIcon({
          className: "custom-icon theater-icon",
          html: `<div class="icon-wrapper">
             <img src="${theatreIcon}"/>
           </div>`,
          iconSize: [25, 25],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });
      case "museum":
        return L.divIcon({
          className: "custom-icon museum-icon",
          html: `<div class="icon-wrapper">
             <img src="${museumIcon}"/>
           </div>`,
          iconSize: [25, 25],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });
      case "artwork":
        return L.divIcon({
          className: "custom-icon artwork-icon",
          html: `<div class="icon-wrapper">
             <img src="${artworkIcon}"/>
           </div>`,
          iconSize: [25, 25],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });
      case "gallery":
        return L.divIcon({
          className: "custom-icon gallery-icon",
          html: `<div class="icon-wrapper">
             <img src="${galleryIcon}"/>
           </div>`,
          iconSize: [25, 25],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });
      default:
        return L.divIcon({
          className: "custom-icon default-icon",
          html: `<div class="icon-wrapper">
             <img src="${defaultIcon}"/>
           </div>`,
          iconSize: [25, 25],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });
    }
  };

  // Set the zoom level conditionally based on locationCoordinates
  const zoomLevel =
    locationCoordinates &&
    locationCoordinates[0] === 7.69398 &&
    locationCoordinates[1] === 80.67592
      ? 8
      : 12;

  return (
    <MapContainer
      ref={mapRef}
      key={locationCoordinates ? locationCoordinates.join("_") : "default"}
      //default location is hard coded
      center={locationCoordinates || [7.291418, 80.636696]}
      zoom={zoomLevel}
      style={{ height: "100%", maxHeight: "80vh" }}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay name="Esri Satellite Overlay">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Google Satellite Overlay">
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
            maxZoom={22}
          />
        </LayersControl.Overlay>
      </LayersControl>

      {landmarks.map((landmark) => {
        const type =
          landmark.properties.tourism || landmark.properties.amenity || "other";
        const customIcon = getIconForType(type);

        return (
          <Marker
            key={landmark._id}
            position={[
              landmark.geometry.coordinates[1],
              landmark.geometry.coordinates[0],
            ]}
            icon={customIcon}
            eventHandlers={{
              mouseover: (e) => {
                e.target.openPopup();
              },
              mouseout: (e) => {
                e.target.closePopup();
              },
            }}
          >
            <Popup closeButton={false}>
              <div onClick={() => handlePopupClick(landmark)}>
                <h4>{type}</h4>
                <p>{landmark.properties.artwork_type}</p>
                <p>{landmark.properties.name}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default OSM;
