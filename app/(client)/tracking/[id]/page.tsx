"use client";
import axios from "axios";
import { LatLng, icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
const size = 32;
const ICON = icon({
  iconUrl: "/marker.png",
  iconSize: [size, size],
  iconAnchor: [size / 2, size],
});
const ICONCar = icon({
  iconUrl: "/delivery-car.png",
  iconSize: [size, size],
  iconAnchor: [size / 2, size],
});

// Dynamically import the required components from react-leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);

const TrackingPage = ({ params }: { params: { id: string } }) => {
  const [shipment, setShipment] = useState<any>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]); // Default center

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const response = await axios.get(`/api/shipment/${params.id}`);
        setShipment(response.data.data);
        console.log(response.data);
        const { currentLocation, destinationLocation } = response.data.data;
        const currentPos = new LatLng(
          currentLocation.coordinates[1],
          currentLocation.coordinates[0]
        );
        const destinationPos = new LatLng(
          destinationLocation.coordinates[1],
          destinationLocation.coordinates[0]
        );
        console.log({ currentLocation, destinationLocation });
        // Calculate distance
        const distanceInMeters = currentPos.distanceTo(destinationPos);
        setDistance(distanceInMeters / 1000); // Convert to kilometers

        // Calculate midpoint
        const midLat = (currentPos.lat + destinationPos.lat) / 2;
        const midLng = (currentPos.lng + destinationPos.lng) / 2;
        setMapCenter([midLat, midLng]);
      } catch (error) {
        console.error("Error fetching shipment data:", error);
      }
    };
    fetchShipment();
  }, [params.id]);
  const MapFitBounds = () => {
    const map = useMap();

    useEffect(() => {
      if (shipment) {
        const bounds = [
          [
            shipment.currentLocation.coordinates[1],
            shipment.currentLocation.coordinates[0],
          ],
          [
            shipment.destinationLocation.coordinates[1],
            shipment.destinationLocation.coordinates[0],
          ],
        ];
        map.fitBounds(bounds);
      }
    }, [shipment, map]);

    return null;
  };
  console.log(mapCenter);
  return (
    <div>
      <h1>Tracking Page</h1>
      {distance !== null && (
        <div>
          <p>Distance from shipper to destination: {distance.toFixed(2)} km</p>
        </div>
      )}
      <MapContainer
        style={{ height: "400px", width: "100%" }}
        center={mapCenter}
        zoom={13}
      >
        <MapFitBounds />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {shipment && (
          <>
            <Marker
              position={[
                shipment.currentLocation.coordinates[1],
                shipment.currentLocation.coordinates[0],
              ]}
              icon={ICONCar}
            >
              <Popup>Current Location</Popup>
            </Marker>
            <Marker
              position={[
                shipment.destinationLocation.coordinates[1],
                shipment.destinationLocation.coordinates[0],
              ]}
              icon={ICON}
            >
              <Popup>Destination</Popup>
            </Marker>
            <Polyline
              positions={[
                [
                  shipment.currentLocation.coordinates[1],
                  shipment.currentLocation.coordinates[0],
                ],
                [
                  shipment.destinationLocation.coordinates[1],
                  shipment.destinationLocation.coordinates[0],
                ],
              ]}
              color="blue"
            >
              {" "}
              <Tooltip>
                <span>Distance: {distance?.toFixed(2)} km</span>
              </Tooltip>
            </Polyline>
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default TrackingPage;
