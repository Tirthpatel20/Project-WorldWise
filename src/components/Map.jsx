import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { useEffect, useState } from "react";
import { useCities } from "../pages/contexts/CitiesContext";
import Flag from "react-world-flags";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "../components/Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function emojiToCountryCode(emoji) {
  if (!emoji) return console.log(emoji);

  const codePoints = [...emoji].map((char) =>
    String.fromCharCode(char.codePointAt(0) - 0x1f1e6 + 65)
  );
  return codePoints.join("");
}

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40.7128, -74.0060]);
  
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  
  const [mapLat, mapLng] = useUrlPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your Position"}
        </Button>
      )}

      <MapContainer
        center={mapPosition}
        zoom={10}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          const code = emojiToCountryCode(city.emoji);
          return (
            <Marker
              key={city.id}
              position={[city.position.lat, city.position.lng]}
            >
              <Popup>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0px",
                  }}
                >
                  <Flag
                    code={code}
                    style={{ width: 25, height: 20, borderRadius: 2 }}
                  />
                  {city.cityName}
                </span>
              </Popup>
            </Marker>
          );
        })}
        <ChangeCentre position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCentre({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
  return null;
}

export default Map;
