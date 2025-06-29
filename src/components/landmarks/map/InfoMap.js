import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const InfoMap = ({ lat, lng }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [googleSatelliteLayer, setGoogleSatelliteLayer] = useState(null);
  const [esriSatelliteLayer, setEsriSatelliteLayer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (lat && lng && mapRef.current) {
          const map = L.map(mapRef.current).setView([lat, lng], 18);

          // Add OpenStreetMap as base layer
          const openStreetMapLayer = L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          ).addTo(map);

          // Add Google Satellite layer
          const googleSatelliteLayer = L.tileLayer(
            "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
            {
              attribution:
                '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
              maxZoom: 21,
            }
          );

          // Add Esri Satellite layer
          const esriSatelliteLayer = L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
              attribution: "&copy; Esri",
              maxZoom: 17,
            }
          );

          // Group the layers
          const overlayLayers = {
            "Google Satellite View": googleSatelliteLayer,
            "Esri Satellite View": esriSatelliteLayer,
          };

          // Add layers to the map control
          L.control.layers(null, overlayLayers).addTo(map);

          // Add marker
          const marker = L.circleMarker([lat, lng], {
            color: "white",
            fillColor: "red",
            fillOpacity: 1,
            radius: 7,
          }).addTo(map);
          markerRef.current = marker;

          setGoogleSatelliteLayer(googleSatelliteLayer);
          setEsriSatelliteLayer(esriSatelliteLayer);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [lat, lng]);

  return (
    <div>
      <div id="map" style={{ height: "350px", width: "100%" }} ref={mapRef} />
    </div>
  );
};

export default InfoMap;
