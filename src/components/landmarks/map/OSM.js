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

  const squareIcon = new L.divIcon({
    className: "square-icon",
    html: '<div class="square"></div>',
  });

  const blueSquareIcon = new L.divIcon({
    className: "square-icon blue",
    html: '<div class="square"></div>',
  });

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

      {landmarks.map((landmark) => (
        <Marker
          key={landmark._id}
          position={[landmark.location.latitude, landmark.location.longitude]}
          icon={squareIcon}
          eventHandlers={{
            mouseover: (e) => {
              e.target.openPopup();
              e.target.setIcon(blueSquareIcon);
            },
            mouseout: (e) => {
              e.target.closePopup();
              e.target.setIcon(squareIcon);
            },
          }}
        >
          <Popup closeButton={false}>
            <div onClick={() => handlePopupClick(landmark)}>
              testing
              {/* <img
                src={property.images[0]}
                alt="Property"
                style={{ width: "100%", height: "40px" }}
              /> */}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default OSM;
